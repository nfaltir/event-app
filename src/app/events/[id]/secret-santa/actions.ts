"use server";

import { db } from "@/db";
import {
  participants,
  secretSantaAssignments,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function generateSecretSanta(eventId: string) {
  const cookieStore = await cookies();

  const participantId =
    cookieStore.get("participant_id")?.value;

  if (!participantId) {
    redirect(`/events/${eventId}/join`);
  }

  // Make sure the participant belongs to THIS event.
  const participant = await db.query.participants.findFirst({
    where: and(
      eq(participants.id, participantId),
      eq(participants.eventId, eventId)
    ),
  });

  if (!participant) {
    redirect(`/events/${eventId}/join`);
  }

  // Check whether this participant already has an assignment.
  const existingAssignment =
    await db.query.secretSantaAssignments.findFirst({
      where: and(
        eq(
          secretSantaAssignments.eventId,
          eventId
        ),
        eq(
          secretSantaAssignments.participantId,
          participantId
        )
      ),
    });

  if (existingAssignment) {
    return;
  }

  // Get all participants for this event.
  const eventParticipants = await db
    .select()
    .from(participants)
    .where(eq(participants.eventId, eventId));

  if (eventParticipants.length < 2) {
    throw new Error(
      "At least 2 participants are required."
    );
  }

  // Check whether assignments already exist for this event.
  const existingAssignments = await db
    .select()
    .from(secretSantaAssignments)
    .where(
      eq(secretSantaAssignments.eventId, eventId)
    );

  /*
   * If assignments don't exist yet, create the complete
   * Secret Santa draw for this event.
   */
  if (existingAssignments.length === 0) {
    const recipients = [...eventParticipants];

    let valid = false;

    while (!valid) {
      for (let i = recipients.length - 1; i > 0; i--) {
        const j = Math.floor(
          Math.random() * (i + 1)
        );

        [recipients[i], recipients[j]] = [
          recipients[j],
          recipients[i],
        ];
      }

      valid = eventParticipants.every(
        (p, index) =>
          p.id !== recipients[index].id
      );
    }

    await db.insert(secretSantaAssignments).values(
      eventParticipants.map((p, index) => ({
        eventId,
        participantId: p.id,
        assignedParticipantId:
          recipients[index].id,
      }))
    );
  }

  redirect(
    `/events/${eventId}/secret-santa`
  );
}