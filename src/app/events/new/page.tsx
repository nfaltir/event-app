import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { createEvent } from "./actions";

export default function NewEventPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <AppHeader />

      <main className="px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            ← Back
          </Link>

          <div className="mt-8">
            <h1 className="text-3xl font-bold">
              Create Event
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Set up your event.
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
                placeholder="Christmas Party 2026"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
                required
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
                placeholder="Annual Christmas gathering"
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-4 font-medium text-white dark:bg-white dark:text-black"
            >
              Create Event
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}