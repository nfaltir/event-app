import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { joinEvent } from "./actions";

type JoinEventPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JoinEventPage({
  params,
}: JoinEventPageProps) {
  const { id } = await params;

  const event = await db.query.events.findFirst({
    where: eq(events.id, id),
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <AppHeader />

      <main className="px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join Event
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            {event.name}
          </h1>

          {event.description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {event.description}
            </p>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold">
              Enter your code
            </h2>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter the participant code you received from the event
              organizer.
            </p>
          </div>

          <form
                action={joinEvent.bind(null, event.id)}
                className="mt-8 space-y-5"
                >
            <div>
              <label
                htmlFor="code"
                className="mb-2 block text-sm font-medium"
              >
                Participant Code
              </label>

              <input
                id="code"
                name="code"
                type="text"
                placeholder="A82F91KD"
                autoCapitalize="characters"
                required
                className="w-full rounded-xl border px-4 py-4 font-mono text-lg tracking-wider outline-none dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-4 font-medium text-white dark:bg-white dark:text-black"
            >
              Enter Event
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}


//0FB7DB4C