import { db } from "@/db";
import { events, participants } from "@/db/schema";
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

            {/* Participants */}
            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Participants
              </p>

              <p className="mt-1 text-2xl font-bold">
                {eventParticipants.length}
              </p>

              {/* Add Participant */}
              <form
                action={addParticipant.bind(null, event.id)}
                className="mt-4 space-y-3"
              >
                <input
                  name="name"
                  type="text"
                  placeholder="Participant name"
                  required
                  className="w-full rounded-xl border px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
                />

                <input
                  name="username"
                  type="text"
                  placeholder="Username (optional)"
                  className="w-full rounded-xl border px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
                />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white dark:bg-white dark:text-black"
                >
                  Add Participant
                </button>
              </form>

              {/* Participant List */}
              {eventParticipants.length > 0 && (
                <div className="mt-6 space-y-3">
                  {eventParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <p className="font-medium">
                        {participant.name}
                      </p>

                      {participant.username && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          @{participant.username}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Access Code
                          </p>

                          <p className="font-mono text-sm font-bold tracking-wider">
                            {participant.accessCode}
                          </p>
                        </div>

                        <CopyCodeButton
                          code={participant.accessCode}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activities */}
            <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Activities
              </p>

              <p className="mt-1 text-2xl font-bold">
                0
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}