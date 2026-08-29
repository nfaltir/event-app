import Link from "next/link";
import AppHeader from "@/components/AppHeader";

/* ---------- icons ---------- */

function IconArrowLeft({ className = "" }: { className?: string }) {
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
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconBrain({ className = "" }: { className?: string }) {
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
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

/* ---------- games list ---------- */

const GAMES = [
  {
    key: "trivia",
    name: "Christmas Trivia",
    blurb:
      "Jeopardy-style trivia, run by a game master. Set up teams, pick categories, keep score, crown a winner.",
    status: "coming-soon" as const,
  },
];

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-[#FBF3E7] text-[#2A1A14] dark:bg-[#1A1113] dark:text-[#EFE6D8]">
      <AppHeader />

      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-2xl">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#2A1A14]/60 transition-colors hover:text-[#C1272D] dark:text-[#EFE6D8]/60 dark:hover:text-[#E9B44C]"
          >
            <IconArrowLeft className="h-4 w-4" />
            Home
          </Link>

          {/* Heading */}
          <div className="mt-4 text-center">
            <p className="font-(family-name:--font-script) text-2xl text-[#C1272D] dark:text-[#E9B44C]">
              Let&apos;s play
            </p>
            <h1 className="mt-1 font-(family-name:--font-display) text-3xl font-semibold sm:text-4xl">
              Christmas Games
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
              Gather the family and play together. A game master runs the show
              while the app keeps score.
            </p>
          </div>

          {/* Games list */}
          <div className="mt-8 space-y-4">
            {GAMES.map((game) => (
              <div
                key={game.key}
                className="flex items-start gap-4 rounded-2xl border border-[#C1272D]/15 bg-white p-6 dark:border-white/10 dark:bg-[#241719]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C1272D] text-white shadow-sm">
                  <IconBrain className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-(family-name:--font-display) text-lg font-semibold">
                      {game.name}
                    </h2>
                    <span className="rounded-full bg-[#E9B44C]/20 px-2.5 py-0.5 text-xs font-semibold text-[#8a6d1f] dark:bg-[#E9B44C]/25 dark:text-[#E9B44C]">
                      Under development
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
                    {game.blurb}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="mt-8 text-center text-sm text-[#2A1A14]/50 dark:text-[#EFE6D8]/40">
            More games are on the way. Check back soon! 🎄
          </p>
        </div>
      </main>
    </div>
  );
}