import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";

/* ---------------------------------------------------------------- */
/*  Icons                                                           */
/* ---------------------------------------------------------------- */

function IconGift({ className }: { className?: string }) {
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
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function IconTree({ className }: { className?: string }) {
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
      <path d="M12 2L7 9h3l-4 6h4l-4 5h12l-4-5h4l-4-6h3L12 2z" />
      <path d="M12 20v2" />
    </svg>
  );
}

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

function IconStar({ className }: { className?: string }) {
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
      <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7L12 18l-6.2 3.2 1.6-7L2 9.5l7.1-.6L12 2z" />
    </svg>
  );
}

function IconKey({ className }: { className?: string }) {
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
      <circle cx="8" cy="15" r="5" />
      <path d="M11.5 11.5L21 2" />
      <path d="M16.5 6.5l3 3" />
    </svg>
  );
}

function IconArrowRight({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

/* ---------------------------------------------------------------- */
/*  Gold snow (light) / white snow (dark) — hero only               */
/* ---------------------------------------------------------------- */

const SNOW_CSS = `
@keyframes home-snowfall {
  0%   { transform: translateY(-12%) translateX(0) rotate(0deg); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(108vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
}
.home-snow {
  position: absolute;
  top: -24px;
  color: #E9B44C;
  filter: drop-shadow(0 0 5px rgba(233,180,76,0.6));
  animation-name: home-snowfall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}
.dark .home-snow {
  color: #ffffff;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.5));
}
@media (prefers-reduced-motion: reduce) {
  .home-snow { animation: none; opacity: 0.5; }
}
`;

const SNOW = [
  { left: "4%", size: 16, dur: "11s", delay: "0s", drift: "20px", spin: "180deg", op: 0.85 },
  { left: "12%", size: 11, dur: "14s", delay: "2s", drift: "-15px", spin: "-160deg", op: 0.6 },
  { left: "20%", size: 20, dur: "9s", delay: "1s", drift: "30px", spin: "200deg", op: 0.9 },
  { left: "28%", size: 9, dur: "16s", delay: "4s", drift: "-10px", spin: "-120deg", op: 0.5 },
  { left: "36%", size: 14, dur: "12s", delay: "0.5s", drift: "25px", spin: "160deg", op: 0.7 },
  { left: "44%", size: 18, dur: "10s", delay: "3s", drift: "-25px", spin: "-200deg", op: 0.85 },
  { left: "52%", size: 11, dur: "15s", delay: "1.5s", drift: "15px", spin: "140deg", op: 0.6 },
  { left: "60%", size: 15, dur: "13s", delay: "5s", drift: "-20px", spin: "-180deg", op: 0.75 },
  { left: "68%", size: 9, dur: "17s", delay: "2.5s", drift: "10px", spin: "120deg", op: 0.5 },
  { left: "76%", size: 20, dur: "9.5s", delay: "0s", drift: "-30px", spin: "-220deg", op: 0.9 },
  { left: "84%", size: 13, dur: "12.5s", delay: "3.5s", drift: "20px", spin: "180deg", op: 0.7 },
  { left: "92%", size: 11, dur: "14.5s", delay: "1s", drift: "-15px", spin: "-150deg", op: 0.6 },
  { left: "8%", size: 13, dur: "13.5s", delay: "6s", drift: "18px", spin: "160deg", op: 0.65 },
  { left: "48%", size: 15, dur: "11.5s", delay: "4.5s", drift: "-22px", spin: "-190deg", op: 0.75 },
  { left: "88%", size: 9, dur: "16.5s", delay: "2s", drift: "12px", spin: "130deg", op: 0.5 },
];

function Snowfall() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <style dangerouslySetInnerHTML={{ __html: SNOW_CSS }} />
      {SNOW.map((flake, i) => (
        <span
          key={i}
          className="home-snow"
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
/*  Step card                                                       */
/* ---------------------------------------------------------------- */

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#C1272D]/12 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#241719]">
      <span className="absolute right-4 top-3 font-(family-name:--font-display) text-4xl font-semibold text-[#C1272D]/10 dark:text-white/10">
        {n}
      </span>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C1272D]/10 text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
        {icon}
      </div>
      <h3 className="mt-4 font-(family-name:--font-display) text-lg font-semibold">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
        {body}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Page                                                            */
/* ---------------------------------------------------------------- */

export default async function HomePage() {
  const eventList = await db
    .select()
    .from(events)
    .orderBy(desc(events.createdAt));

  return (
    <div className="min-h-screen bg-[#FBF3E7] text-[#2A1A14] dark:bg-[#1A1113] dark:text-[#EFE6D8]">
      <AppHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#C1272D]/10 bg-linear-to-b from-[#F7E4D3] via-[#FBF3E7] to-[#FBF3E7] dark:border-white/5 dark:from-[#2A1113] dark:via-[#1A1113] dark:to-[#1A1113]">
          <Snowfall />

          <div className="relative mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-6 lg:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C1272D]/20 bg-white/70 px-4 py-1.5 font-(family-name:--font-script) text-lg text-[#C1272D] backdrop-blur dark:border-[#E9B44C]/25 dark:bg-[#241719]/70 dark:text-[#E9B44C]">
              <IconStar className="h-4 w-4" />
              A little holiday magic
            </span>

            <h1 className="mx-auto mt-6 max-w-3xl font-(family-name:--font-display) text-5xl font-semibold tracking-tight sm:text-6xl">
              Draw your{" "}
              <span className="relative whitespace-nowrap text-[#C1272D] dark:text-[#E9B44C]">
                Secret Santa
                <IconSnowflake className="absolute -right-9 -top-6 hidden h-7 w-7 text-[#E9B44C] sm:block" />
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base text-[#2A1A14]/70 dark:text-[#EFE6D8]/70 sm:text-lg">
              No spreadsheets, no hats full of paper. Everyone pulls their own
              name — and nobody sees anyone else&apos;s.
            </p>

            <div className="mt-9 flex items-center justify-center">
              <Link
                href="#events"
                className="inline-flex items-center gap-2 rounded-full bg-[#C1272D] px-7 py-4 font-bold text-white shadow-[0_10px_30px_-8px_rgba(193,39,45,0.5)] transition-colors hover:bg-[#8E1D22]"
              >
                <IconGift className="h-5 w-5" />
                Find your event
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
          <p className="text-center font-(family-name:--font-script) text-2xl text-[#C1272D] dark:text-[#E9B44C]">
            How it works
          </p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Step
              n={1}
              icon={<IconKey className="h-5 w-5" />}
              title="Enter your code"
              body="Your organiser sends you a private code. Pick your event and type it in."
            />
            <Step
              n={2}
              icon={<IconGift className="h-5 w-5" />}
              title="Pull a name"
              body="Tap once. You get one person from everyone still in the hat."
            />
            <Step
              n={3}
              icon={<IconStar className="h-5 w-5" />}
              title="Go shopping"
              body="Your tag is saved. Come back any time to see it — nobody else can."
            />
          </div>
        </section>

        {/* Events */}
        <section
          id="events"
          className="mx-auto w-full max-w-5xl scroll-mt-8 px-4 pb-24 sm:px-6"
        >
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C1272D]/10 text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
                <IconTree className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-(family-name:--font-display) text-2xl font-semibold tracking-tight">
                  Your events
                </h2>
                <p className="mt-0.5 text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
                  Pick the one you were invited to.
                </p>
              </div>
            </div>

            {eventList.length > 0 ? (
              <span className="shrink-0 rounded-full bg-[#C1272D]/10 px-3 py-1 text-xs font-bold text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
                {eventList.length}
              </span>
            ) : null}
          </div>

          <div className="mt-6">
            {eventList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#C1272D]/25 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-[#241719]">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C1272D]/10 text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
                  <IconTree className="h-6 w-6" />
                </div>
                <p className="mt-4 font-(family-name:--font-display) text-lg font-semibold">
                  No events yet
                </p>
                <p className="mx-auto mt-1 max-w-xs text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/50">
                  Once your organiser sets one up, it&apos;ll show here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {eventList.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}/join`}
                    className="group flex flex-col rounded-2xl border border-[#C1272D]/12 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C1272D]/30 hover:shadow-[0_16px_40px_-16px_rgba(193,39,45,0.3)] dark:border-white/10 dark:bg-[#241719] dark:hover:border-[#E9B44C]/30"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C1272D]/10 text-[#C1272D] transition-transform group-hover:scale-105 dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
                      <IconGift className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 font-(family-name:--font-display) text-lg font-semibold leading-snug">
                      {event.name}
                    </h3>

                    {event.description ? (
                      <p className="mt-1.5 text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
                        {event.description}
                      </p>
                    ) : null}

                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#C1272D] dark:text-[#E9B44C]">
                      Enter your code
                      <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}