"use client";

import { deleteParticipant } from "./actions";

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

export default function DeleteParticipantButton({
  eventId,
  participantId,
  participantName,
  drawsExist,
}: {
  eventId: string;
  participantId: string;
  participantName: string;
  drawsExist: boolean;
}) {
  async function handleDelete() {
    if (drawsExist) {
      window.alert(
        "Reset the draw first.\n\nSomeone has already drawn their Secret Santa. Removing a participant now would break everyone's assignments. Use \u201CReset all draws\u201D, then you can remove people and re-draw."
      );
      return;
    }

    const ok = window.confirm(
      `Remove ${participantName} from this event?\n\nThis deletes their access code too. This can't be undone.`
    );
    if (ok) {
      await deleteParticipant(eventId, participantId);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      aria-label={`Remove ${participantName}`}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C1272D]/8 text-[#C1272D] transition-colors hover:bg-[#C1272D]/15 dark:bg-[#C1272D]/15 dark:text-[#E9B44C] dark:hover:bg-[#C1272D]/25"    >
      <IconTrash className="h-4 w-4" />
    </button>
  );
}