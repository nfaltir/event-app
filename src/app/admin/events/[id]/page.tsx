import { db } from "@/db";
import {
  events,
  participants,
  secretSantaAssignments,
} from "@/db/schema";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/session";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import CopyCodeButton from "@/components/CopyCodeButton";
import { addParticipant } from "./actions";

type AdminEventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEventPage({
  params,
}: AdminEventPageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const session = await verifyAdminSession(token);

  if (!session || session.eventId !== id) {
    redirect("/admin/login");
  }

  const event = await db.query.events.findFirst({
    where: eq(events.id, id),
  });

  if (!event) {
    notFound();
  }

  const eventParticipants = await db
    .select()
    .from(participants)
    .where(eq(participants.eventId, id));

  const assignments = await db
    .select()
    .from(secretSantaAssignments)
    .where(eq(secretSantaAssignments.eventId, id));

  const participantMap = new Map(
    eventParticipants.map((participant) => [
      participant.id,
      participant,
    ])
  );

  const assignedParticipantIds = new Set(
    assignments.map((assignment) => assignment.participantId)
  );

  const assignedCount = assignments.length;
  const totalParticipants = eventParticipants.length;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <AppHeader />

      <main className="px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {event.name}
          </h1>

          {event.description && (
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              {event.description}
            </p>
          )}

          {/* Admin Code */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Admin Code
            </p>

            <p className="mt-2 font-mono text-2xl font-bold tracking-[0.25em]">
              {event.adminCode}
            </p>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Save this code somewhere safe. You can use it to manage
              this event later.
            </p>

            <CopyCodeButton code={event.adminCode} />
          </div>

          <div className="mt-6 space-y-4">
            {/* Event Status */}
            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Event Status
              </p>

              <p className="mt-1 font-medium capitalize">
                {event.status}
              </p>
            </div>

            {/* Add Participant */}
            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Add Participant
              </p>

              <form
                action={async (formData) => {
                  "use server";
                  await addParticipant(id, formData);
                }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium"
                  >
                    Username
                    <span className="ml-1 font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="john123"
                    autoComplete="off"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Add Participant
                </button>
              </form>
            </div>

            {/* Participants */}
            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Participants
              </p>

              <p className="mt-1 text-2xl font-bold">
                {eventParticipants.length}
              </p>

              <div className="mt-4 space-y-3">
                {eventParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900"
                  >
                    <p className="font-medium">
                      {participant.name}
                    </p>

                    {participant.username && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{participant.username}
                      </p>
                    )}

                    <p className="mt-2 font-mono text-sm tracking-wider">
                      {participant.accessCode}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Secret Santa Status */}
            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Secret Santa Status
              </p>

              <p className="mt-1 text-2xl font-bold">
                {assignedCount} / {totalParticipants}
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                participants assigned
              </p>

              <div className="mt-5 space-y-3">
                {eventParticipants.map((participant) => {
                  const assignment = assignments.find(
                    (item) =>
                      item.participantId === participant.id
                  );

                  const assignedParticipant = assignment
                    ? participantMap.get(
                        assignment.assignedParticipantId
                      )
                    : null;

                  return (
                    <div
                      key={participant.id}
                      className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">
                            {participant.name}
                          </p>

                          {assignment && assignedParticipant ? (
                            <>
                              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Secret Santa
                              </p>

                              <p className="font-medium">
                                {assignedParticipant.name}
                              </p>

                              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Assigned{" "}
                                {assignment.createdAt.toLocaleString(
                                  "en-US",
                                  {
                                    dateStyle: "long",
                                    timeStyle: "short",
                                  }
                                )}
                              </p>
                            </>
                          ) : (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              Not assigned yet
                            </p>
                          )}
                        </div>

                        <div className="shrink-0">
                          {assignment ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Assigned
                            </span>
                          ) : (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                              Waiting
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}