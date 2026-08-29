import { db } from "@/db";
import {
  events,
  participants,
  secretSantaAssignments,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import DrawExperience from "./DrawExperience";

/* ---------------------------------------------------------------- */
/*  Icons                                                           */
/* ---------------------------------------------------------------- */

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

/* ---------------------------------------------------------------- */
/*  Gold snow (light) / white snow (dark) — ambient                 */
/* ---------------------------------------------------------------- */

const SNOW_CSS = `
@keyframes tag-snowfall {
  0%   { transform: translateY(-12%) translateX(0) rotate(0deg); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(112vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
}
.tag-snow {
  position: absolute;
  top: -24px;
  color: #E9B44C;
  filter: drop-shadow(0 0 5px rgba(233,180,76,0.65));
  animation-name: tag-snowfall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}
.dark .tag-snow {
  color: #ffffff;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.5));
}
@media (prefers-reduced-motion: reduce) {
  .tag-snow { animation: none; opacity: 0.55; }
}
`;

const SNOW = [
  { left: "6%", size: 15, dur: "12s", delay: "0s", drift: "22px", spin: "180deg", op: 0.8 },
  { left: "16%", size: 10, dur: "15s", delay: "2s", drift: "-16px", spin: "-150deg", op: 0.6 },
  { left: "27%", size: 19, dur: "10s", delay: "1s", drift: "30px", spin: "200deg", op: 0.85 },
  { left: "38%", size: 12, dur: "16s", delay: "3.5s", drift: "-12px", spin: "-120deg", op: 0.65 },
  { left: "50%", size: 16, dur: "11s", delay: "0.5s", drift: "26px", spin: "160deg", op: 0.8 },
  { left: "61%", size: 10, dur: "17s", delay: "4.5s", drift: "-24px", spin: "-190deg", op: 0.55 },
  { left: "72%", size: 18, dur: "10.5s", delay: "1.5s", drift: "18px", spin: "150deg", op: 0.85 },
  { left: "83%", size: 12, dur: "14s", delay: "3s", drift: "-20px", spin: "-170deg", op: 0.65 },
  { left: "92%", size: 14, dur: "12.5s", delay: "5s", drift: "14px", spin: "140deg", op: 0.7 },
  { left: "44%", size: 11, dur: "13.5s", delay: "6s", drift: "-18px", spin: "-160deg", op: 0.6 },
  { left: "34%", size: 13, dur: "11.5s", delay: "2.5s", drift: "20px", spin: "170deg", op: 0.7 },
];

function TagSnow() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <style dangerouslySetInnerHTML={{ __html: SNOW_CSS }} />
      {SNOW.map((flake, i) => (
        <span
          key={i}
          className="tag-snow"
          style={
            {
              left: flake.left,
              width: flake.size,
              height: flake.size,
              opacity: flake.op,
              animationDuration: flake.dur,
              animationDelay: flake.delay,
              ["--drift" as string]: flake.drift,
              ["--spin" as string]: flake.spin,
            } as React.CSSProperties
          }
        >
          <IconSnowflake className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Page                                                            */
/* ---------------------------------------------------------------- */

type SecretSantaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SecretSantaPage({
  params,
}: SecretSantaPageProps) {
  const { id } = await params;

  const event = await db.query.events.findFirst({
    where: eq(events.id, id),
  });

  if (!event) {
    notFound();
  }

  const cookieStore = await cookies();
  const participantId = cookieStore.get("participant_id")?.value;

  if (!participantId) {
    redirect(`/events/${id}/join`);
  }

  const participant = await db.query.participants.findFirst({
    where: and(
      eq(participants.id, participantId),
      eq(participants.eventId, id)
    ),
  });

  if (!participant) {
    redirect(`/events/${id}/join`);
  }

  const assignment = await db.query.secretSantaAssignments.findFirst({
    where: and(
      eq(secretSantaAssignments.eventId, id),
      eq(secretSantaAssignments.participantId, participant.id)
    ),
  });

  let assignedParticipant = null;

  if (assignment) {
    assignedParticipant = await db.query.participants.findFirst({
      where: eq(participants.id, assignment.assignedParticipantId),
    });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FBF3E7] text-[#2A1A14] dark:bg-[#1A1113] dark:text-[#EFE6D8]">
      <AppHeader />

      <TagSnow />

      <main className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-md">
          {/* Event heading */}
          <div className="text-center">
            <p className="font-(family-name:--font-script) text-2xl text-[#C1272D] dark:text-[#E9B44C]">
              Secret Santa
            </p>
            <h1 className="mt-1 font-(family-name:--font-display) text-3xl font-semibold sm:text-4xl">
              {event.name}
            </h1>
            {event.description ? (
              <p className="mx-auto mt-2 max-w-sm text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
                {event.description}
              </p>
            ) : null}
          </div>

          {/* Wishlist entry */}
          <div className="mt-6 text-center">
            <a
              href={`/events/${id}/wishlist`}
              className="inline-flex items-center gap-2 rounded-full border border-[#C1272D]/25 px-5 py-2.5 text-sm font-bold text-[#C1272D] transition-colors hover:bg-[#C1272D]/5 dark:border-[#E9B44C]/30 dark:text-[#E9B44C] dark:hover:bg-white/5"
            >
              🎁 My wishlist
            </a>
          </div>

          {!assignment ? (
            /* ---------------- Pre-draw: the envelope ---------------- */
            <DrawExperience
              eventId={id}
              giverName={participant.name}
              giverUsername={participant.username}
            />
          ) : (
            /* ---------------- Already drawn: the tag ---------------- */
            <div className="mt-10">
              <div className="mx-auto max-w-sm -rotate-1 rounded-[26px] border border-[#C1272D]/20 bg-white px-8 pb-9 pt-9 text-center shadow-[0_20px_50px_-16px_rgba(193,39,45,0.35)] dark:border-white/10 dark:bg-[#241719]">
                <p className="font-(family-name:--font-script) text-3xl text-[#C1272D] dark:text-[#E9B44C]">
                  Congratulations 🎉
                </p>

                <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-[#2A1A14]/50 dark:text-[#EFE6D8]/50">
                  You drew
                </p>

                <p className="mt-2 font-(family-name:--font-display) text-5xl font-semibold leading-tight text-[#2A1A14] dark:text-white">
                  {assignedParticipant?.name}
                </p>

                {assignedParticipant?.username ? (
                  <p className="mt-2 font-mono text-sm text-[#2A1A14]/50 dark:text-[#EFE6D8]/50">
                    @{assignedParticipant.username}
                  </p>
                ) : null}

                <div className="my-6 border-t border-dashed border-[#C1272D]/25 dark:border-white/15" />

                <p className="text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/60">
                  You&apos;re their Secret Santa
                </p>

                <p className="mt-3 font-(family-name:--font-script) text-lg text-[#2A1A14]/50 dark:text-[#EFE6D8]/50">
                  {participant.username
                    ? `@${participant.username}`
                    : participant.name}
                </p>

                <p className="mt-4 text-xs text-[#2A1A14]/45 dark:text-[#EFE6D8]/40">
                  {assignment.createdAt.toLocaleString("en-US", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              </div>

              <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-[#2A1A14]/60 dark:text-[#EFE6D8]/50">
                Only you can see this. Come back any time & it won&apos;t change.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}