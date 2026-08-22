"use server";

import { db } from "@/db";
import { participants } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function joinEvent(
  eventId: string,
  formData: FormData
) {
  const code = formData.get("code")?.toString().trim().toUpperCase();

  if (!code) {
    throw new Error("Participant code is required.");
  }

  const participant = await db.query.participants.findFirst({
    where: and(
      eq(participants.eventId, eventId),
      eq(participants.accessCode, code)
    ),
  });

  if (!participant) {
    throw new Error("Invalid participant code.");
  }

  const cookieStore = await cookies();

  cookieStore.set("participant_id", participant.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  redirect(`/events/${eventId}/secret-santa`);
}