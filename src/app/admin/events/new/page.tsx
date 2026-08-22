import Link from "next/link";
import { createEvent } from "./actions";
import AppHeader from "@/components/AppHeader";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <AppHeader />

      <main className="px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Create Event
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create a new event for your participants.
            </p>
          </div>

          <form action={createEvent} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Event name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Secret Santa 2026"
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Add a description for this event..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-4 font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Create Event
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}