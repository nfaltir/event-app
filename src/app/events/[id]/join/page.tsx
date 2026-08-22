import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { joinEvent } from "./actions";

function IconKey({ className }: { className?: string }) {
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
      <circle cx="8" cy="15" r="5" />
      <path d="M11.5 11.5L21 2" />
      <path d="M16.5 6.5l3 3" />
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

type JoinEventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JoinEventPage({ params }: JoinEventPageProps) {
  const { id } = await params;

  const event = await db.query.events.findFirst({
    where: eq(events.id, id),
  });

  if (!event) {
    notFound();
  }

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
            All events
          </Link>

          {/* Event heading */}
          <div className="mt-5 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C1272D] text-white shadow-sm">
              <IconKey className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-(family-name:--font-script) text-xl text-[#C1272D] dark:text-[#E9B44C]">
                Join the exchange
              </p>
              <h1 className="mt-0.5 font-(family-name:--font-display) text-2xl font-semibold leading-tight sm:text-3xl">
                {event.name}
              </h1>
            </div>
          </div>

          {event.description ? (
            <p className="mt-3 text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
              {event.description}
            </p>
          ) : null}

          {/* Code card */}
          <div className="mt-8 rounded-3xl border border-[#C1272D]/15 bg-white p-7 shadow-[0_12px_40px_-16px_rgba(193,39,45,0.28)] dark:border-white/10 dark:bg-[#241719]">
            <h2 className="font-(family-name:--font-display) text-xl font-semibold">
              Enter your code
            </h2>
            <p className="mt-1.5 text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
              Use the private code your organiser sent you.
            </p>

            <form
              action={joinEvent.bind(null, event.id)}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="code"
                  className="mb-2 block text-sm font-semibold"
                >
                  Your code
                </label>

                <input
                  id="code"
                  name="code"
                  type="text"
                  placeholder="A82F91KD"
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  required
                  className="w-full rounded-2xl border border-[#C1272D]/20 bg-[#FBF3E7] px-4 py-4 text-center font-mono text-xl uppercase tracking-[0.3em] text-[#2A1A14] outline-none transition-all placeholder:tracking-[0.3em] placeholder:text-[#2A1A14]/25 focus:border-[#C1272D] focus:bg-white focus:ring-4 focus:ring-[#C1272D]/15 dark:border-white/15 dark:bg-[#1A1113] dark:text-white dark:placeholder:text-white/25 dark:focus:border-[#E9B44C] dark:focus:bg-[#1A1113] dark:focus:ring-[#E9B44C]/15"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C1272D] px-6 py-4 font-bold text-white shadow-[0_10px_28px_-10px_rgba(193,39,45,0.55)] transition-colors hover:bg-[#8E1D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1272D] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#E9B44C] dark:focus-visible:ring-offset-[#241719]"
              >
                <IconKey className="h-4 w-4" />
                Enter event
              </button>
            </form>
          </div>

          {/* Reassurance */}
          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-[#2A1A14]/60 dark:text-[#EFE6D8]/50">
            <IconLock className="h-3.5 w-3.5" />
            Your draw stays private — nobody else can see it.
          </p>
        </div>
      </main>
    </div>
  );
}