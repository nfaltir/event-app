"use client";

import { useState } from "react";
import { editParticipant } from "./actions";

function IconPencil({ className }: { className?: string }) {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
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
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

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

export default function EditableParticipantName({
  eventId,
  participantId,
  name,
  username,
}: {
  eventId: string;
  participantId: string;
  name: string;
  username: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(formData: FormData) {
    setSaving(true);
    try {
      await editParticipant(eventId, participantId, formData);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex min-w-0 items-start gap-1.5">
        <div className="min-w-0">
          <p className="truncate font-(family-name:--font-display) font-semibold">
            {name}
          </p>
          {username && (
            <p className="truncate text-sm text-[#2A1A14]/50 dark:text-[#EFE6D8]/50">
              @{username}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Edit ${name}`}
          className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#2A1A14]/35 transition-colors hover:bg-[#C1272D]/10 hover:text-[#C1272D] dark:text-[#EFE6D8]/35 dark:hover:bg-[#C1272D]/20 dark:hover:text-[#E9B44C]"
        >
          <IconPencil className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form action={handleSave} className="min-w-0 flex-1 space-y-2">
      <input
        name="name"
        defaultValue={name}
        required
        autoFocus
        placeholder="Name"
        className="w-full rounded-lg border border-[#C1272D]/25 bg-white px-2.5 py-1.5 text-sm font-semibold text-[#2A1A14] outline-none focus:border-[#C1272D] focus:ring-2 focus:ring-[#C1272D]/15 dark:border-white/15 dark:bg-[#1A1113] dark:text-white dark:focus:border-[#E9B44C] dark:focus:ring-[#E9B44C]/15"
      />
      <input
        name="username"
        defaultValue={username ?? ""}
        placeholder="Username (optional)"
        autoComplete="off"
        className="w-full rounded-lg border border-[#C1272D]/20 bg-white px-2.5 py-1.5 text-sm text-[#2A1A14] outline-none focus:border-[#C1272D] focus:ring-2 focus:ring-[#C1272D]/15 dark:border-white/15 dark:bg-[#1A1113] dark:text-white dark:focus:border-[#E9B44C] dark:focus:ring-[#E9B44C]/15"
      />

      <div className="flex items-center gap-1.5">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1 rounded-lg bg-[#C1272D] px-2.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#8E1D22] disabled:opacity-60"
        >
          <IconCheck className="h-3.5 w-3.5" />
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={saving}
          className="inline-flex items-center gap-1 rounded-lg border border-[#C1272D]/20 px-2.5 py-1.5 text-xs font-semibold text-[#2A1A14]/70 transition-colors hover:bg-[#C1272D]/5 disabled:opacity-60 dark:border-white/15 dark:text-[#EFE6D8]/70 dark:hover:bg-white/5"
        >
          <IconX className="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>
    </form>
  );
}