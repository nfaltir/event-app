import Link from "next/link";
import AppHeader from "@/components/AppHeader";

/* ---------- icons ---------- */

function IconGift({ className }: { className?: string }) {
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
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
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

/* ---------- not found ---------- */

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FBF3E7] text-[#2A1A14] dark:bg-[#1A1113] dark:text-[#EFE6D8]">
      <AppHeader />

      <main className="flex items-center justify-center px-4 py-20 sm:py-28">
        <div className="w-full max-w-md text-center">
          {/* Big 404 with a gift tucked in */}
          <div className="flex items-center justify-center gap-3">
            <span className="font-(family-name:--font-display) text-7xl font-semibold text-[#C1272D]/20 dark:text-[#E9B44C]/20">
              4
            </span>
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C1272D] text-white shadow-[0_10px_30px_-10px_rgba(193,39,45,0.5)]">
              <IconGift className="h-8 w-8" />
            </span>
            <span className="font-(family-name:--font-display) text-7xl font-semibold text-[#C1272D]/20 dark:text-[#E9B44C]/20">
              4
            </span>
          </div>

          {/* Message */}
          <p className="mt-6 font-(family-name:--font-script) text-2xl text-[#C1272D] dark:text-[#E9B44C]">
            Nothing under this tree
          </p>

          <h1 className="mt-1 font-(family-name:--font-display) text-3xl font-semibold">
            Page not found
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
            This page might have moved, or the link wasn&apos;t quite right.
            Let&apos;s get you back to the fun.
          </p>

          {/* Action */}
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#C1272D] px-6 py-3.5 font-bold text-white shadow-[0_10px_28px_-10px_rgba(193,39,45,0.55)] transition-colors hover:bg-[#8E1D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1272D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF3E7] dark:focus-visible:ring-[#E9B44C] dark:focus-visible:ring-offset-[#1A1113]"
          >
            <IconArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </div>
      </main>
    </div>
  );
}