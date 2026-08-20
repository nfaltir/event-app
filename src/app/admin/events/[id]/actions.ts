"use server";

import { db } from "@/db";
import {
  participants,
  secretSantaAssignments,
} from "@/db/schema";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/session";
import { generateCode } from "@/lib/codes";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function verifyAdmin(eventId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const session = await verifyAdminSession(token);

  if (!session || session.eventId !== eventId) {
    redirect("/admin/login");
  }
}

export async function addParticipant(
  eventId: string,
  formData: FormData
) {
  await verifyAdmin(eventId);

  const name = formData.get("name")?.toString().trim();
  const username = formData.get("username")?.toString().trim();

  if (!name) {
    throw new Error("Participant name is required.");
  }

  const accessCode = generateCode();

  await db.insert(participants).values({
    eventId,
    name,
    username: username || null,
    accessCode,
  });

  redirect(`/admin/events/${eventId}`);
}

export async function generateSecretSanta(eventId: string) {
  await verifyAdmin(eventId);

  const eventParticipants = await db
    .select()
    .from(participants)
    .where(eq(participants.eventId, eventId));

  if (eventParticipants.length < 2) {
    throw new Error(
      "You need at least 2 participants to generate Secret Santa."
    );
  }

  const existingAssignments = await db
    .select()
    .from(secretSantaAssignments)
    .where(eq(secretSantaAssignments.eventId, eventId));

  if (existingAssignments.length > 0) {
    throw new Error(
      "Secret Santa assignments have already been generated."
    );
  }

  const recipients = [...eventParticipants];

  let valid = false;

  while (!valid) {
    for (let i = recipients.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [recipients[i], recipients[j]] = [
        recipients[j],
        recipients[i],
      ];
    }

    valid = eventParticipants.every(
      (participant, index) =>
        participant.id !== recipients[index].id
    );
  }

  await db.insert(secretSantaAssignments).values(
    eventParticipants.map((participant, index) => ({
      eventId,
      participantId: participant.id,
      assignedParticipantId: recipients[index].id,
    }))
  );
}