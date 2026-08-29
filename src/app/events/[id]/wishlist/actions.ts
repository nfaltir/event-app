"use server";

import { db } from "@/db";
import { participants, wishes } from "@/db/schema";
import { and, eq, count } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const MAX_WISHES = 3;

/**
 * Resolves the current participant from the cookie, scoped to this event.
 * Returns null if there's no valid participant for this event — the caller
 * decides what to do (the page redirects to join).
 */
async function getCurrentParticipant(eventId: string) {
  const cookieStore = await cookies();
  const participantId = cookieStore.get("participant_id")?.value;

  if (!participantId) return null;

  const participant = await db.query.participants.findFirst({
    where: and(
      eq(participants.id, participantId),
      eq(participants.eventId, eventId)
    ),
  });

  return participant ?? null;
}

export async function addWish(eventId: string, formData: FormData) {
  const participant = await getCurrentParticipant(eventId);
  if (!participant) {
    throw new Error("You need to join this event first.");
  }

  const text = formData.get("text")?.toString().trim();
  if (!text) {
    throw new Error("Wish can't be empty.");
  }
  if (text.length > 200) {
    throw new Error("Wish is too long (max 200 characters).");
  }

  // Enforce the 1–3 limit server-side.
  const [{ value: existingCount }] = await db
    .select({ value: count() })
    .from(wishes)
    .where(eq(wishes.participantId, participant.id));

  if (existingCount >= MAX_WISHES) {
    throw new Error(`You can only add up to ${MAX_WISHES} wishes.`);
  }

  await db.insert(wishes).values({
    eventId,
    participantId: participant.id,
    text,
  });

  revalidatePath(`/events/${eventId}/wishlist`);
}

export async function deleteWish(eventId: string, wishId: string) {
  const participant = await getCurrentParticipant(eventId);
  if (!participant) {
    throw new Error("You need to join this event first.");
  }

  // Can only delete your OWN wish — scoped to your participant id.
  await db
    .delete(wishes)
    .where(
      and(
        eq(wishes.id, wishId),
        eq(wishes.participantId, participant.id)
      )
    );

  revalidatePath(`/events/${eventId}/wishlist`);
}