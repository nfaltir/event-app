import { db } from "@/db";
import { events, participants, secretSantaAssignments } from "@/db/schema";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/session";
import { count } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { logout } from "@/app/admin/logout/actions";

/* ---------- icons ---------- */

function IconLogOut({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

function IconPlus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconUsers({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconGift({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function IconCalendar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* ---------- page ---------- */

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const session = await verifyAdminSession(token);

  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  const allEvents = await db.select().from(events).orderBy(events.createdAt);

  const participantCounts = await db
    .select({ eventId: participants.eventId, count: count() })
    .from(participants)
    .groupBy(participants.eventId);

  const assignmentCounts = await db
    .select({ eventId: secretSantaAssignments.eventId, count: count() })
    .from(secretSantaAssignments)
    .groupBy(secretSantaAssignments.eventId);

  const participantCountMap = new Map(
    participantCounts.map((item) => [item.eventId, Number(item.count)])
  );

  const assignmentCountMap = new Map(
    assignmentCounts.map((item) => [item.eventId, Number(item.count)])
  );

  const totalParticipants = [...participantCountMap.values()].reduce(
    (a, b) => a + b,
    0
  );

  const totalAssigned = [...assignmentCountMap.values()].reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="min-h-screen bg-[#FBF3E7] text-[#2A1A14] dark:bg-[#1A1113] dark:text-[#EFE6D8]">
      <AppHeader />

      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-6xl">
          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-(family-name:--font-script) text-xl text-[#C1272D] dark:text-[#E9B44C]">
                Organiser
              </p>

              <h1 className="mt-0.5 font-(family-name:--font-display) text-3xl font-semibold tracking-tight sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
                Manage your events and participants.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C1272D]/20 bg-white px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#C1272D]/5 dark:border-white/15 dark:bg-[#241719] dark:hover:bg-white/5"
                >
                  <IconLogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>

              <Link
                href="/admin/events/new"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C1272D] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_-10px_rgba(193,39,45,0.55)] transition-colors hover:bg-[#8E1D22]"
              >
                <IconPlus className="h-4 w-4" />
                Create event
              </Link>
            </div>
          </div>

          {/* Summary stats */}
          {allEvents.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryStat label="Events" value={allEvents.length} icon={<IconCalendar className="h-5 w-5" />} />
              <SummaryStat label="Participants" value={totalParticipants} icon={<IconUsers className="h-5 w-5" />} />
              <SummaryStat label="Assigned" value={totalAssigned} icon={<IconGift className="h-5 w-5" />} />
            </div>
          )}

          {/* Events */}
          {allEvents.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-[#C1272D]/25 bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-[#241719]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C1272D]/10 text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
                <IconCalendar className="h-6 w-6" />
              </div>

              <h2 className="mt-4 font-(family-name:--font-display) text-lg font-semibold">
                No events yet
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/50">
                Create your first event, add participants, and share their access codes.
              </p>

              <Link
                href="/admin/events/new"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C1272D] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_24px_-10px_rgba(193,39,45,0.55)] transition-colors hover:bg-[#8E1D22]"
              >
                <IconPlus className="h-4 w-4" />
                Create event
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {allEvents.map((event) => {
                const participantCount = participantCountMap.get(event.id) ?? 0;
                const assignmentCount = assignmentCountMap.get(event.id) ?? 0;

                const pct =
                  participantCount > 0
                    ? Math.round((assignmentCount / participantCount) * 100)
                    : 0;

                const complete =
                  participantCount > 0 && assignmentCount === participantCount;

                return (
                  <div
                    key={event.id}
                    className="group flex flex-col rounded-2xl border border-[#C1272D]/12 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#C1272D]/30 hover:shadow-[0_16px_40px_-16px_rgba(193,39,45,0.28)] dark:border-white/10 dark:bg-[#241719] dark:hover:border-[#E9B44C]/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="min-w-0 font-(family-name:--font-display) text-lg font-semibold leading-snug">
                        {event.name}
                      </h2>

                      <span className="shrink-0 rounded-full bg-[#C1272D]/10 px-2.5 py-1 text-xs font-semibold capitalize text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
                        {event.status}
                      </span>
                    </div>

                    {event.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
                        {event.description}
                      </p>
                    )}

                    {/* Progress */}
                    <div className="mt-5">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="inline-flex items-center gap-1.5 text-[#2A1A14]/60 dark:text-[#EFE6D8]/60">
                          <IconGift className="h-4 w-4" />
                          Assigned
                        </span>

                        <span className="font-mono font-semibold tabular-nums">
                          {assignmentCount}
                          <span className="text-[#2A1A14]/40 dark:text-[#EFE6D8]/40">
                            {" / "}
                            {participantCount}
                          </span>
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#C1272D]/10 dark:bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all ${
                            complete ? "bg-[#2F5A43]" : "bg-[#C1272D]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/60">
                      <IconUsers className="h-4 w-4" />
                      {participantCount}{" "}
                      {participantCount === 1 ? "participant" : "participants"}
                    </div>

                    <Link
                      href={`/admin/events/${event.id}`}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#C1272D]/20 px-4 py-2.5 text-sm font-semibold text-[#C1272D] transition-colors hover:bg-[#C1272D]/5 dark:border-white/15 dark:text-[#E9B44C] dark:hover:bg-white/5"
                    >
                      Manage event
                      <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#C1272D]/12 bg-white p-5 dark:border-white/10 dark:bg-[#241719]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C1272D]/10 text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
        {icon}
      </div>

      <div>
        <p className="text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/60">{label}</p>
        <p className="font-(family-name:--font-display) text-2xl font-semibold tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
}