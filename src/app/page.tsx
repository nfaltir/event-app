import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

export default async function HomePage() {
  const eventList = await db
    .select()
    .from(events)
    .orderBy(desc(events.createdAt));

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <AppHeader />

      <main className="px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Events
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Select your event to get started.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {eventList.length === 0 ? (
              <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400">
                  No events available.
                </p>
              </div>
            ) : (
              eventList.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}/join`}
                  className="block rounded-xl border border-gray-200 p-5 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                >
                  <h2 className="font-semibold">
                    {event.name}
                  </h2>

                  {event.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {event.description}
                    </p>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}