"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { createAdminSession, COOKIE_NAME } from "@/lib/session";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const code = formData.get("code")?.toString().trim().toUpperCase();

  if (!code) {
    throw new Error("Admin code is required.");
  }

  const event = await db.query.events.findFirst({
    where: eq(events.adminCode, code),
  });

  if (!event) {
    throw new Error("Invalid admin code.");
  }

  const token = await createAdminSession(event.id);

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