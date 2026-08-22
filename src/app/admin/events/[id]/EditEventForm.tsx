"use client";

import { useState } from "react";
import { editEvent } from "./actions";

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

export default function EditEventForm({
  eventId,
  name,
  description,
}: {
  eventId: string;
  name: string;
  description: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(formData: FormData) {
    setSaving(true);
    try {
      await editEvent(eventId, formData);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#C1272D]/20 px-3 py-1.5 text-xs font-semibold text-[#C1272D] transition-colors hover:bg-[#C1272D]/5 dark:border-[#E9B44C]/25 dark:text-[#E9B44C] dark:hover:bg-white/5"
      >
        <IconPencil className="h-3.5 w-3.5" />
        Edit event
      </button>
    );
  }

  return (
    <form
      action={handleSave}
      className="mt-4 space-y-3 rounded-2xl border border-[#C1272D]/15 bg-white p-5 dark:border-white/10 dark:bg-[#241719]"
    >
      <div>
        <label
          htmlFor="edit-name"
          className="mb-1.5 block text-sm font-semibold"
        >
          Event name
        </label>
        <input
          id="edit-name"
          name="name"
          defaultValue={name}
          required
          autoFocus
          className="w-full rounded-xl border border-[#C1272D]/20 bg-white px-3 py-2 text-sm text-[#2A1A14] outline-none focus:border-[#C1272D] focus:ring-2 focus:ring-[#C1272D]/15 dark:border-white/15 dark:bg-[#1A1113] dark:text-white dark:focus:border-[#E9B44C] dark:focus:ring-[#E9B44C]/15"
        />
      </div>

      <div>
        <label
          htmlFor="edit-desc"
          className="mb-1.5 block text-sm font-semibold"
        >
          Description
        </label>
        <textarea
          id="edit-desc"
          name="description"
          defaultValue={description ?? ""}
          rows={3}
          className="w-full rounded-xl border border-[#C1272D]/20 bg-white px-3 py-2 text-sm text-[#2A1A14] outline-none focus:border-[#C1272D] focus:ring-2 focus:ring-[#C1272D]/15 dark:border-white/15 dark:bg-[#1A1113] dark:text-white dark:focus:border-[#E9B44C] dark:focus:ring-[#E9B44C]/15"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1 rounded-full bg-[#C1272D] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#8E1D22] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          disabled={saving}
          className="inline-flex items-center rounded-full border border-[#C1272D]/20 px-4 py-2 text-sm font-semibold text-[#2A1A14]/70 transition-colors hover:bg-[#C1272D]/5 disabled:opacity-60 dark:border-white/15 dark:text-[#EFE6D8]/70 dark:hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}