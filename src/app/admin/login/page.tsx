import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { loginAdmin } from "./actions";

export default function AdminLoginPage() {
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
              Manage Event
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter your event admin code.
            </p>
          </div>

          <form className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="code"
                className="mb-2 block text-sm font-medium"
              >
                Admin code
              </label>

              <input
                id="code"
                name="code"
                type="text"
                placeholder="A91F72BC"
                autoCapitalize="characters"
                autoComplete="off"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-mono uppercase tracking-widest outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-6 py-4 font-medium text-white dark:bg-white dark:text-black"
            >
              Continue
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}