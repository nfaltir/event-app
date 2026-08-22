"use client";

import Link from "next/link";

/* ---------- icons ---------- */

function IconSnowflake({ className }: { className?: string }) {
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
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="M4.9 4.9l14.2 14.2" />
      <path d="M19.1 4.9L4.9 19.1" />
      <path d="M12 2l2.5 2.5M12 2L9.5 4.5" />
      <path d="M12 22l2.5-2.5M12 22l-2.5-2.5" />
      <path d="M2 12l2.5 2.5M2 12l2.5-2.5" />
      <path d="M22 12l-2.5 2.5M22 12l-2.5-2.5" />
    </svg>
  );
}

function IconRefresh({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

/* ---------- error boundary ---------- */

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF3E7] px-4 text-[#2A1A14] dark:bg-[#1A1113] dark:text-[#EFE6D8]">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C1272D] text-white shadow-[0_10px_30px_-10px_rgba(193,39,45,0.5)]">
          <IconSnowflake className="h-8 w-8" />
        </div>

        {/* Message */}
        <p className="mt-6 font-(family-name:--font-script) text-2xl text-[#C1272D] dark:text-[#E9B44C]">
          Oh crumbs
        </p>

        <h1 className="mt-1 font-(family-name:--font-display) text-3xl font-semibold">
          Something went sideways
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
          That didn&apos;t work as expected. It might just be a hiccup give it
          another try, or head back home and start again.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C1272D] px-6 py-3.5 font-bold text-white shadow-[0_10px_28px_-10px_rgba(193,39,45,0.55)] transition-colors hover:bg-[#8E1D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1272D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF3E7] sm:w-auto dark:focus-visible:ring-[#E9B44C] dark:focus-visible:ring-offset-[#1A1113]"
          >
            <IconRefresh className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full border border-[#C1272D]/20 px-6 py-3.5 font-semibold text-[#C1272D] transition-colors hover:bg-[#C1272D]/5 sm:w-auto dark:border-white/15 dark:text-[#E9B44C] dark:hover:bg-white/5"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}