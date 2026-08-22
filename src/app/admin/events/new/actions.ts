"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/session";
import { generateCode } from "@/lib/codes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const session = await verifyAdminSession(token);

  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  const name = formData.get("name")?.toString().trim();
  const description = formData
    .get("description")
    ?.toString()
    .trim();

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
    .returning();

  redirect(`/admin/events/${event.id}`);
}