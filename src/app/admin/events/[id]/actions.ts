"use server";

import { db } from "@/db";
import { eq, and, count } from "drizzle-orm";
import { events, participants, secretSantaAssignments } from "@/db/schema";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/session";
import { generateCode } from "@/lib/codes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function verifyAdmin(eventId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const session = await verifyAdminSession(token);

  if (!session || session.role !== "admin") {
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

  revalidatePath(`/admin/events/${eventId}`);
}

export async function resetDraw(eventId: string) {
  await verifyAdmin(eventId);

  await db
    .delete(secretSantaAssignments)
    .where(eq(secretSantaAssignments.eventId, eventId));

  revalidatePath(`/admin/events/${eventId}`);
}


export async function deleteParticipant(
  eventId: string,
  participantId: string
) {
  await verifyAdmin(eventId);

  // Guard: refuse to delete once any draw exists for this event.
  // Removing a participant mid-draw would corrupt everyone's assignments.
  const [{ value: assignmentCount }] = await db
    .select({ value: count() })
    .from(secretSantaAssignments)
    .where(eq(secretSantaAssignments.eventId, eventId));

  if (assignmentCount > 0) {
    throw new Error(
      "Reset the draw before removing participants."
    );
  }

  await db
    .delete(participants)
    .where(
      and(
        eq(participants.id, participantId),
        eq(participants.eventId, eventId)
      )
    );

  revalidatePath(`/admin/events/${eventId}`);
}

export async function editParticipant(
  eventId: string,
  participantId: string,
  formData: FormData
) {
  await verifyAdmin(eventId);

  const name = formData.get("name")?.toString().trim();
  const username = formData.get("username")?.toString().trim();

  if (!name) {
    throw new Error("Name is required.");
  }

  await db
    .update(participants)
    .set({
      name,
      username: username || null,
    })
    .where(
      and(
        eq(participants.id, participantId),
        eq(participants.eventId, eventId)
      )
    );

  revalidatePath(`/admin/events/${eventId}`);
}

export async function editEvent(eventId: string, formData: FormData) {
  await verifyAdmin(eventId);

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const budgetRaw = formData.get("budget")?.toString().trim();
  const currencyRaw = formData.get("currency")?.toString().trim();


  if (!name) {
    throw new Error("Event name is required.");
  }

  // Currency is display-only metadata; accept only known codes.
  const allowedCurrencies = ["USD", "EUR", "PHP"];
  const currency = allowedCurrencies.includes(currencyRaw ?? "")
    ? (currencyRaw as string)
    : "USD";

  // Budget is entered in whole dollars, stored as cents. Empty = no budget.
  let budget: number | null = null;
  if (budgetRaw) {
    const dollars = Number(budgetRaw);
    if (!Number.isFinite(dollars) || dollars < 0) {
      throw new Error("Budget must be a positive number.");
    }
    budget = Math.round(dollars * 100);
  }

  await db
    .update(events)
    .set({
      name,
      description: description || null,
      budget,
      currency,
    })
    .where(eq(events.id, eventId));

  revalidatePath(`/admin/events/${eventId}`);
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
}

export async function deleteEvent(eventId: string, confirmName: string) {
  await verifyAdmin(eventId);

  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });

  if (!event) {
    throw new Error("Event not found.");
  }

  if (confirmName.trim() !== event.name) {
    throw new Error("The name you typed doesn't match this event.");
  }

  await db.delete(events).where(eq(events.id, eventId));

  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard");
}