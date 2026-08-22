import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { loginAdmin } from "./actions";

function IconLock({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FBF3E7] text-[#2A1A14] dark:bg-[#1A1113] dark:text-[#EFE6D8]">
      <AppHeader />

      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-md">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#2A1A14]/60 transition-colors hover:text-[#C1272D] dark:text-[#EFE6D8]/60 dark:hover:text-[#E9B44C]"
          >
            <IconArrowLeft className="h-4 w-4" />
            Back home
          </Link>

          {/* Heading */}
          <div className="mt-6 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C1272D] text-white shadow-sm">
              <IconLock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-(family-name:--font-script) text-xl text-[#C1272D] dark:text-[#E9B44C]">
                Organiser
              </p>
              <h1 className="mt-0.5 font-(family-name:--font-display) text-2xl font-semibold leading-tight sm:text-3xl">
                Admin login
              </h1>
            </div>
          </div>

          {/* Card */}
          <div className="mt-8 rounded-3xl border border-[#C1272D]/15 bg-white p-7 shadow-[0_12px_40px_-16px_rgba(193,39,45,0.28)] dark:border-white/10 dark:bg-[#241719]">
            <p className="text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
              Enter the admin password to manage events.
            </p>

            <form action={loginAdmin} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="code"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <input
                  id="code"
                  name="code"
                  type="password"
                  placeholder="Enter admin password"
                  autoComplete="off"
                  required
className="w-full rounded-2xl border border-[#C1272D]/20 bg-white px-4 py-3.5 font-mono tracking-widest text-[#2A1A14] outline-none transition-all placeholder:text-[#2A1A14]/25 focus:border-[#C1272D] focus:ring-4 focus:ring-[#C1272D]/15 dark:border-white/15 dark:bg-[#1A1113] dark:text-white dark:placeholder:text-white/25 dark:focus:border-[#E9B44C] dark:focus:ring-[#E9B44C]/15"                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C1272D] px-6 py-4 font-bold text-white shadow-[0_10px_28px_-10px_rgba(193,39,45,0.55)] transition-colors hover:bg-[#8E1D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1272D] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#E9B44C] dark:focus-visible:ring-offset-[#241719]"
              >
                <IconLock className="h-4 w-4" />
                Log in
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}