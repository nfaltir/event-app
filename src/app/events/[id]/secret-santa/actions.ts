"use server";

import { db } from "@/db";
import { events, participants, secretSantaAssignments } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const PARTICIPANT_COOKIE = "participant_id";

export type DrawResult = {
  name: string;
  username: string | null;
};

export async function generateSecretSanta(
  eventId: string
): Promise<DrawResult> {
  const cookieStore = await cookies();
  const participantId = cookieStore.get(PARTICIPANT_COOKIE)?.value;

  if (!participantId) {
    throw new Error("Not authenticated. Enter your access code first.");
  }

  const recipient = await db.transaction(async (tx) => {
    // Serialize concurrent draws for this event.
    await tx
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .for("update");

    // The requesting participant must belong to this event.
    const me = await tx
      .select()
      .from(participants)
      .where(
        and(
          eq(participants.id, participantId),
          eq(participants.eventId, eventId)
        )
      )
      .then((rows) => rows[0]);

    if (!me) {
      throw new Error("You are not a participant in this event.");
    }

    const allParticipants = await tx
      .select()
      .from(participants)
      .where(eq(participants.eventId, eventId));

    if (allParticipants.length < 2) {
      throw new Error("This event needs at least 2 participants.");
    }

    const assignments = await tx
      .select()
      .from(secretSantaAssignments)
      .where(eq(secretSantaAssignments.eventId, eventId));

    const byId = new Map(allParticipants.map((p) => [p.id, p]));

    // Already drew — return the existing recipient, write nothing.
    const existing = assignments.find((a) => a.participantId === me.id);
    if (existing) {
      return byId.get(existing.assignedParticipantId) ?? null;
    }

    const drawnGiverIds = new Set(assignments.map((a) => a.participantId));
    const takenRecipientIds = new Set(
      assignments.map((a) => a.assignedParticipantId)
    );

    const remainingGivers = allParticipants.filter(
      (p) => !drawnGiverIds.has(p.id)
    );
    const availableRecipients = allParticipants.filter(
      (p) => !takenRecipientIds.has(p.id)
    );

    let candidates = availableRecipients.filter((p) => p.id !== me.id);

    // Feasibility guard.
    //
    // The remaining graph is complete bipartite minus each giver's own name,
    // so a perfect matching always exists — except when one giver and one
    // recipient are left and they are the same person.
    //
    // That state is only reachable from two remaining givers. If the other
    // remaining giver is still an available recipient, this draw MUST take
    // them, or they end up stranded holding their own name.
    if (remainingGivers.length === 2) {
      const other = remainingGivers.find((p) => p.id !== me.id)!;
      const forced = candidates.find((p) => p.id === other.id);
      if (forced) {
        candidates = [forced];
      }
    }

    if (candidates.length === 0) {
      throw new Error("No valid recipient available.");
    }

    const picked =
      candidates[Math.floor(Math.random() * candidates.length)];

    // Exactly one row.
    await tx.insert(secretSantaAssignments).values({
      eventId,
      participantId: me.id,
      assignedParticipantId: picked.id,
    });

    return picked;
  });

  revalidatePath(`/events/${eventId}/secret-santa`);
  revalidatePath(`/admin/events/${eventId}`);

  if (!recipient) {
    throw new Error("Could not determine your Secret Santa.");
  }

  return { name: recipient.name, username: recipient.username };
}