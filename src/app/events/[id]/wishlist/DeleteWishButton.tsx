"use client";

import { deleteWish } from "./actions";

function IconX({ className }: { className?: string }) {
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
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export default function DeleteWishButton({
  eventId,
  wishId,
}: {
  eventId: string;
  wishId: string;
}) {
  async function handleDelete() {
    await deleteWish(eventId, wishId);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      aria-label="Remove wish"
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#2A1A14]/40 transition-colors hover:bg-[#C1272D]/10 hover:text-[#C1272D] dark:text-[#EFE6D8]/40 dark:hover:bg-[#C1272D]/20 dark:hover:text-[#E9B44C]"
    >
      <IconX className="h-4 w-4" />
    </button>
  );
}