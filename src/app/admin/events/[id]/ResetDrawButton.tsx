"use client";

import { resetDraw } from "./actions";

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

export default function ResetDrawButton({
  eventId,
  assignedCount,
}: {
  eventId: string;
  assignedCount: number;
}) {
  if (assignedCount === 0) return null;

  async function handleReset() {
    const ok = window.confirm(
      `Reset the draw?\n\nThis clears all ${assignedCount} assignment${
        assignedCount === 1 ? "" : "s"
      }. Everyone will need to draw again — but their access codes stay the same, so there's no need to resend anything.`
    );
    if (ok) {
      await resetDraw(eventId);
    }
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#C1272D]/25 px-4 py-2.5 text-sm font-semibold text-[#C1272D] transition-colors hover:bg-[#C1272D]/5 dark:border-[#E9B44C]/25 dark:text-[#E9B44C] dark:hover:bg-white/5"
    >
      <IconRefresh className="h-4 w-4" />
      Reset all draws
    </button>
  );
}