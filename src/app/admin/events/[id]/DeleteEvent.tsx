"use client";

import { useState } from "react";
import { deleteEvent } from "./actions";

function IconTrash({ className }: { className?: string }) {
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
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function IconWarning({ className }: { className?: string }) {
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
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

export default function DeleteEventZone({
  eventId,
  eventName,
  participantCount,
}: {
  eventId: string;
  eventName: string;
  participantCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matches = typed.trim() === eventName;

  async function handleDelete() {
    if (!matches || deleting) return;
    setError(null);
    setDeleting(true);
    try {
      await deleteEvent(eventId, typed);
      // On success the action redirects to the dashboard, so no further UI.
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not delete. Try again."
      );
      setDeleting(false);
    }
  }

  return (
    <section className="mt-10 rounded-2xl border border-[#C1272D]/30 bg-[#C1272D]/3 p-6 dark:border-[#C1272D]/40 dark:bg-[#C1272D]/10">
      <div className="flex items-center gap-2 text-[#C1272D] dark:text-[#E9B44C]">
        <IconWarning className="h-4 w-4" />
        <h2 className="text-sm font-bold uppercase tracking-wider">
          Danger zone
        </h2>
      </div>

      {!open ? (
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
            Delete this event, its {participantCount}{" "}
            {participantCount === 1 ? "participant" : "participants"}, and all
            their draws. This can&apos;t be undone.
          </p>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#C1272D] px-4 py-2.5 text-sm font-bold text-[#C1272D] transition-colors hover:bg-[#C1272D] hover:text-white dark:border-[#C1272D] dark:text-[#E9B44C] dark:hover:bg-[#C1272D] dark:hover:text-white"
          >
            <IconTrash className="h-4 w-4" />
            Delete event
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-[#2A1A14]/80 dark:text-[#EFE6D8]/70">
            This permanently deletes the event and everyone in it. To confirm,
            type the event name:{" "}
            <span className="font-bold text-[#C1272D] dark:text-[#E9B44C]">
              {eventName}
            </span>
          </p>

          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type the event name"
            autoFocus
            className="mt-3 w-full rounded-xl border border-[#C1272D]/25 bg-white px-3 py-2.5 text-sm text-[#2A1A14] outline-none focus:border-[#C1272D] focus:ring-2 focus:ring-[#C1272D]/15 dark:border-white/15 dark:bg-[#1A1113] dark:text-white dark:focus:border-[#E9B44C] dark:focus:ring-[#E9B44C]/15"
          />

          {error ? (
            <p className="mt-2 text-sm font-semibold text-[#C1272D] dark:text-[#E9B44C]">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={!matches || deleting}
              className="inline-flex items-center gap-2 rounded-full bg-[#C1272D] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#8E1D22] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconTrash className="h-4 w-4" />
              {deleting ? "Deleting…" : "Delete this event"}
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setTyped("");
                setError(null);
              }}
              disabled={deleting}
              className="inline-flex items-center rounded-full border border-[#C1272D]/20 px-4 py-2.5 text-sm font-semibold text-[#2A1A14]/70 transition-colors hover:bg-[#C1272D]/5 disabled:opacity-60 dark:border-white/15 dark:text-[#EFE6D8]/70 dark:hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}