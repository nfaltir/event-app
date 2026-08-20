import { db } from "@/db";
import {
  events,
  participants,
  secretSantaAssignments,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { generateSecretSanta } from "./actions";

type SecretSantaPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SecretSantaPage({
  params,
}: SecretSantaPageProps) {
  const { id } = await params;

  const event = await db.query.events.findFirst({
    where: eq(events.id, id),
  });

  if (!event) {
    notFound();
  }

  const cookieStore = await cookies();

  const participantId =
    cookieStore.get("participant_id")?.value;

  if (!participantId) {
    redirect(`/events/${id}/join`);
  }

  // Make sure this participant belongs to this event.
  const participant = await db.query.participants.findFirst({
    where: and(
      eq(participants.id, participantId),
      eq(participants.eventId, id)
    ),
  });

  if (!participant) {
    redirect(`/events/${id}/join`);
  }

  const assignment =
    await db.query.secretSantaAssignments.findFirst({
      where: and(
        eq(secretSantaAssignments.eventId, id),
        eq(
          secretSantaAssignments.participantId,
          participant.id
        )
      ),
    });

  let assignedParticipant = null;

  if (assignment) {
    assignedParticipant =
      await db.query.participants.findFirst({
        where: eq(
          participants.id,
          assignment.assignedParticipantId
        ),
      });
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <AppHeader />

      <main className="px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Secret Santa
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {event.name}
          </h1>

          {event.description && (
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {event.description}
            </p>
          )}

          <div className="mt-8 rounded-2xl border border-gray-200 p-6 dark:border-gray-800">
            {!assignment ? (
              <>
                <h2 className="text-xl font-semibold">
                  Ready?
                </h2>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Click below to reveal your Secret Santa.
                </p>

                <form
                  action={async () => {
                    "use server";
                    await generateSecretSanta(id);
                  }}
                  className="mt-6"
                >
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-black px-6 py-4 font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Generate Secret Santa
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your name
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {participant.name}
                </p>

                <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your Secret Santa
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {assignedParticipant?.name}
                </p>

                {assignedParticipant?.username && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    @{assignedParticipant.username}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}