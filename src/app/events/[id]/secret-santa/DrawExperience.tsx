"use client";

import { useState, useTransition } from "react";
import { generateSecretSanta, type DrawResult } from "./actions";

/* ---------------------------------------------------------------- */
/*  Props                                                            */
/* ---------------------------------------------------------------- */

type DrawExperienceProps = {
  eventId: string;
  giverName: string;
  giverUsername: string | null;
};

/* ---------------------------------------------------------------- */
/*  Animation CSS — transform/opacity only (GPU, TV-smooth)         */
/* ---------------------------------------------------------------- */

const ENVELOPE_CSS = `
@keyframes env-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
@keyframes env-shake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  20%      { transform: translateX(-4px) rotate(-1.5deg); }
  40%      { transform: translateX(4px) rotate(1.5deg); }
  60%      { transform: translateX(-3px) rotate(-1deg); }
  80%      { transform: translateX(3px) rotate(1deg); }
}
@keyframes seal-spin {
  to { transform: rotate(360deg); }
}
@keyframes card-rise {
  0%   { transform: translateY(30px) scale(0.9); opacity: 0; }
  60%  { opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes flap-open {
  0%   { transform: rotateX(0deg); }
  100% { transform: rotateX(180deg); }
}

.env-idle       { animation: env-float 3.2s ease-in-out infinite; }
.env-shaking    { animation: env-shake 0.6s ease-in-out infinite; }
.seal-spinning  { animation: seal-spin 0.9s linear infinite; }
.card-rising    { animation: card-rise 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
.flap-opening   { animation: flap-open 0.5s ease-in forwards; transform-origin: top; }

@media (prefers-reduced-motion: reduce) {
  .env-idle, .env-shaking, .seal-spinning, .card-rising, .flap-opening {
    animation: none;
  }
}
`;

/* ---------------------------------------------------------------- */
/*  Component                                                        */
/* ---------------------------------------------------------------- */

type Phase = "idle" | "opening" | "revealed";

export default function DrawExperience({
  eventId,
  giverName,
  giverUsername,
}: DrawExperienceProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<DrawResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleOpen = () => {
    if (phase !== "idle") return;
    setError(null);
    setPhase("opening");

    // Guarantee the animation runs at least this long, regardless of DB speed,
    // so the moment feels deliberate rather than abrupt.
    const minDuration = new Promise((r) => setTimeout(r, 1400));

    startTransition(async () => {
      try {
        const [drawn] = await Promise.all([
          generateSecretSanta(eventId),
          minDuration,
        ]);
        setResult(drawn);
        setPhase("revealed");
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Something went wrong. Try again."
        );
        setPhase("idle");
      }
    });
  };

  /* ----- Revealed: the tag ----- */
  if (phase === "revealed" && result) {
    return (
      <div className="mt-10">
        <style dangerouslySetInnerHTML={{ __html: ENVELOPE_CSS }} />

        <div className="card-rising mx-auto max-w-sm -rotate-1 rounded-[26px] border border-[#C1272D]/20 bg-white px-8 pb-9 pt-9 text-center shadow-[0_20px_50px_-16px_rgba(193,39,45,0.35)] dark:border-white/10 dark:bg-[#241719]">
          <p className="font-(family-name:--font-script) text-3xl text-[#C1272D] dark:text-[#E9B44C]">
            Congratulations 🎉
          </p>

          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-[#2A1A14]/50 dark:text-[#EFE6D8]/50">
            You drew
          </p>

          <p className="mt-2 font-(family-name:--font-display) text-5xl font-semibold leading-tight text-[#2A1A14] dark:text-white">
            {result.name}
          </p>

          {result.username ? (
            <p className="mt-2 font-mono text-sm text-[#2A1A14]/50 dark:text-[#EFE6D8]/50">
              @{result.username}
            </p>
          ) : null}

          <div className="my-6 border-t border-dashed border-[#C1272D]/25 dark:border-white/15" />

          <p className="text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/60">
            You&apos;re their Secret Santa
          </p>

          <p className="mt-3 font-(family-name:--font-script) text-lg text-[#2A1A14]/50 dark:text-[#EFE6D8]/50">
            {giverUsername ? `@${giverUsername}` : giverName}
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#2A1A14]/55 dark:text-[#EFE6D8]/45">
          Only you can see this. Come back any time — it won&apos;t change.
        </p>
      </div>
    );
  }

  /* ----- Idle / Opening: the envelope ----- */
  const opening = phase === "opening";

  return (
    <div className="mt-10 flex flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: ENVELOPE_CSS }} />

      {/* Envelope */}
      <div
        className={`relative h-44 w-72 ${opening ? "env-shaking" : "env-idle"}`}
        aria-hidden="true"
      >
        {/* body */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-[#C1272D] to-[#8E1D22] shadow-[0_18px_45px_-14px_rgba(193,39,45,0.55)]" />

        {/* gold inner border */}
        <div className="absolute inset-1.5 rounded-xl border border-[#E9B44C]/50" />

        {/* diagonal flaps (gold lines) */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 288 176"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M6 20 L144 104 L282 20" stroke="#E9B44C" strokeWidth="2" strokeOpacity="0.55" fill="none" />
          <path d="M6 156 L110 92" stroke="#E9B44C" strokeWidth="2" strokeOpacity="0.3" fill="none" />
          <path d="M282 156 L178 92" stroke="#E9B44C" strokeWidth="2" strokeOpacity="0.3" fill="none" />
        </svg>

        {/* top flap that opens */}
        <div
          className={`absolute left-0 top-0 h-[52%] w-full ${
            opening ? "flap-opening" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 288 92"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0 H288 L144 88 Z"
              fill="#A81E23"
              stroke="#E9B44C"
              strokeWidth="2"
              strokeOpacity="0.6"
            />
          </svg>
        </div>

        {/* wax seal / loader */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {opening ? (
            <svg
              className="seal-spinning h-12 w-12"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="20" stroke="#E9B44C" strokeOpacity="0.3" strokeWidth="4" />
              <path
                d="M24 4 a20 20 0 0 1 20 20"
                stroke="#E9B44C"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9B44C] text-[#8E1D22] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                <path
                  d="M12 3l2.9 6.9 7.1.6-5.4 4.7 1.6 7L12 18l-6.2 3.2 1.6-7L2 10.5l7.1-.6L12 3z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Caption + button */}
      <h2 className="mt-8 font-(family-name:--font-display) text-2xl font-semibold text-[#2A1A14] dark:text-[#EFE6D8]">
        {opening ? "Opening…" : `Ready, ${giverName}?`}
      </h2>

      <p className="mx-auto mt-2 max-w-xs text-center text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
        {opening
          ? "Pulling a name from everyone still in the hat…"
          : "One tap opens your envelope. You only get to do this once so take a breath first."}
      </p>

      {error ? (
        <p className="mt-4 text-center text-sm font-semibold text-[#C1272D] dark:text-[#E9B44C]">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleOpen}
        disabled={opening}
        className="mt-6 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#C1272D] px-6 py-4 font-bold text-white shadow-[0_10px_28px_-10px_rgba(193,39,45,0.55)] transition-colors hover:bg-[#8E1D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1272D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF3E7] disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-[#1A1113]"
      >
        {opening ? "Opening…" : "Open my envelope"}
      </button>
    </div>
  );
}