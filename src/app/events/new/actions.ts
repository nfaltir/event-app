"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { generateCode } from "@/lib/codes";
import {
  createAdminSession,
  COOKIE_NAME,
} from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!name) {
    throw new Error("Event name is required.");
  }

  const adminCode = generateCode();

  const [event] = await db
    .insert(events)
    .values({
      name,
      description: description || null,
      adminCode,
    })
    .returning({
      id: events.id,
    });

  const token = await createAdminSession();

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(`/admin/events/${event.id}`);
}