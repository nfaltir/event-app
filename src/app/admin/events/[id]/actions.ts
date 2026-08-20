"use server";

import { db } from "@/db";
import { participants } from "@/db/schema";
import { generateCode } from "@/lib/codes";
import { redirect } from "next/navigation";

export async function addParticipant(
  eventId: string,
  formData: FormData
) {
  const name = formData.get("name")?.toString().trim();
  const username = formData.get("username")?.toString().trim();

  if (!name) {
    throw new Error("Participant name is required.");
  }

  await db.insert(participants).values({
    eventId,
    name,
    username: username || null,
    accessCode: generateCode(),
  });

  redirect(`/admin/events/${eventId}`);
}