"use client";

import { useState } from "react";

type CopyCodeButtonProps = {
  code: string;
};

export default function CopyCodeButton({
  code,
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-4 w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
    >
      {copied ? "Copied!" : "Copy Code"}
    </button>
  );
}