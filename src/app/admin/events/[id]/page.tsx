import { db } from "@/db";
import {
  events,
  participants,
  secretSantaAssignments,
} from "@/db/schema";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/session";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import CopyCodeButton from "@/components/CopyCodeButton";
import { addParticipant } from "./actions";
import ResetDrawButton from "./ResetDrawButton";
import DeleteParticipantButton from "./DeleteParticipantButton";
import EditableParticipantName from "./EditableParticipantName";
import EditEventForm from "./EditEventForm";

/* ---------- icons ---------- */

type IconProps = { className?: string };

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconArrowLeft({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconKey({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3" />
    </svg>
  );
}

function IconUsers({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconUserPlus({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  );
}

function IconGift({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function IconCheck({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function IconClock({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconArrowRight({ className = "" }: IconProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/* ---------- page ---------- */

type AdminEventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEventPage({ params }: AdminEventPageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const session = await verifyAdminSession(token);

  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  const event = await db.query.events.findFirst({
    where: eq(events.id, id),
  });

  if (!event) {
    notFound();
  }

  const eventParticipants = await db
    .select()
    .from(participants)
    .where(eq(participants.eventId, id));

  const assignments = await db
    .select()
    .from(secretSantaAssignments)
    .where(eq(secretSantaAssignments.eventId, id));

  const participantMap = new Map(
    eventParticipants.map((participant) => [participant.id, participant])
  );

  const assignmentMap = new Map(
    assignments.map((assignment) => [assignment.participantId, assignment])
  );

  const assignedCount = assignments.length;
  const totalParticipants = eventParticipants.length;

  const pct =
    totalParticipants > 0
      ? Math.round((assignedCount / totalParticipants) * 100)
      : 0;

  const complete = totalParticipants > 0 && assignedCount === totalParticipants;

  const fieldClass =
    "w-full rounded-xl border border-[#C1272D]/20 bg-[#FBF3E7] px-4 py-2.5 text-sm text-[#2A1A14] outline-none transition-all placeholder:text-[#2A1A14]/30 focus:border-[#C1272D] focus:bg-white focus:ring-4 focus:ring-[#C1272D]/15 dark:border-white/15 dark:bg-[#1A1113] dark:text-white dark:placeholder:text-white/30 dark:focus:border-[#E9B44C] dark:focus:ring-[#E9B44C]/15";

  return (
    <div className="min-h-screen bg-[#FBF3E7] text-[#2A1A14] dark:bg-[#1A1113] dark:text-[#EFE6D8]">
      <AppHeader />

      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-6xl">
          {/* Back link */}
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[#2A1A14]/60 transition-colors hover:text-[#C1272D] dark:text-[#EFE6D8]/60 dark:hover:text-[#E9B44C]"
          >
            <IconArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          {/* Header */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="font-(family-name:--font-script) text-xl text-[#C1272D] dark:text-[#E9B44C]">
                Organiser
              </p>
              <h1 className="mt-0.5 font-(family-name:--font-display) text-3xl font-semibold tracking-tight sm:text-4xl">
                {event.name}
              </h1>

              {event.description && (
                <p className="mt-2 max-w-2xl text-sm text-[#2A1A14]/70 dark:text-[#EFE6D8]/60">
                  {event.description}
                </p>
              )}
                            <EditEventForm
                eventId={id}
                name={event.name}
                description={event.description}
              />
            </div>

            <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-[#C1272D]/10 px-3 py-1 text-xs font-semibold capitalize text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2F5A43]" />
              {event.status}
            </span>
          </div>

          {/* Two-column layout */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Sidebar */}
            <div className="space-y-6 lg:col-span-1">
              {/* Admin code */}
              <section className="rounded-2xl border border-[#C1272D]/12 bg-white p-6 dark:border-white/10 dark:bg-[#241719]">
                <div className="flex items-center gap-2 text-[#2A1A14]/60 dark:text-[#EFE6D8]/60">
                  <IconKey className="h-4 w-4" />
                  <h2 className="text-sm font-semibold">Admin code</h2>
                </div>

                <p className="mt-3 break-all font-mono text-2xl font-bold tracking-[0.2em] text-[#C1272D] dark:text-[#E9B44C]">
                  {event.adminCode}
                </p>

                <p className="mt-3 text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/50">
                  Keep this safe. Use it to manage the event later.
                </p>

                <CopyCodeButton code={event.adminCode} />
              </section>

              {/* Draw progress */}
              <section className="rounded-2xl border border-[#C1272D]/12 bg-white p-6 dark:border-white/10 dark:bg-[#241719]">
                <div className="flex items-center gap-2 text-[#2A1A14]/60 dark:text-[#EFE6D8]/60">
                  <IconGift className="h-4 w-4" />
                  <h2 className="text-sm font-semibold">Draw progress</h2>
                </div>

                <p className="mt-3 font-(family-name:--font-display) text-3xl font-semibold tabular-nums">
                  {assignedCount}
                  <span className="text-[#2A1A14]/40 dark:text-[#EFE6D8]/40">
                    {" / "}
                    {totalParticipants}
                  </span>
                </p>

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#C1272D]/10 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${
                      complete ? "bg-[#2F5A43]" : "bg-[#C1272D]"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/50">
                  {complete
                    ? "Everyone has drawn."
                    : `${totalParticipants - assignedCount} still to draw.`}
                </p>

                <ResetDrawButton eventId={id} assignedCount={assignedCount} />
              </section>

              {/* Add participant */}
              <section className="rounded-2xl border border-[#C1272D]/12 bg-white p-6 dark:border-white/10 dark:bg-[#241719]">
                <div className="flex items-center gap-2 text-[#2A1A14]/60 dark:text-[#EFE6D8]/60">
                  <IconUserPlus className="h-4 w-4" />
                  <h2 className="text-sm font-semibold">Add participant</h2>
                </div>

                <form
                  action={async (formData) => {
                    "use server";
                    await addParticipant(id, formData);
                  }}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-semibold">
                      Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John"
                      required
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className="mb-1.5 block text-sm font-semibold">
                      Username
                      <span className="ml-1 font-normal text-[#2A1A14]/40 dark:text-[#EFE6D8]/40">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="john123"
                      autoComplete="off"
                      className={fieldClass}
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#C1272D] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_24px_-10px_rgba(193,39,45,0.55)] transition-colors hover:bg-[#8E1D22]"
                  >
                    <IconUserPlus className="h-4 w-4" />
                    Add participant
                  </button>
                </form>
              </section>
            </div>

            {/* Participants */}
            <div className="lg:col-span-2">
              <section className="rounded-2xl border border-[#C1272D]/12 bg-white p-6 dark:border-white/10 dark:bg-[#241719]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[#2A1A14]/60 dark:text-[#EFE6D8]/60">
                    <IconUsers className="h-4 w-4" />
                    <h2 className="text-sm font-semibold">Participants</h2>
                  </div>

                  <span className="rounded-full bg-[#C1272D]/10 px-2.5 py-1 text-xs font-semibold tabular-nums text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
                    {totalParticipants}
                  </span>
                </div>

                {totalParticipants === 0 ? (
                  <div className="mt-6 rounded-xl border border-dashed border-[#C1272D]/25 px-6 py-12 text-center dark:border-white/15">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C1272D]/10 text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
                      <IconUsers className="h-6 w-6" />
                    </div>

                    <p className="mt-4 font-(family-name:--font-display) font-semibold">
                      No participants yet
                    </p>

                    <p className="mx-auto mt-1 max-w-xs text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/50">
                      Add at least two people, then send each of them their access code.
                    </p>
                  </div>
                ) : (
                  <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {eventParticipants.map((participant) => {
                      const assignment = assignmentMap.get(participant.id);

                      const assignedParticipant = assignment
                        ? participantMap.get(assignment.assignedParticipantId)
                        : null;

                      return (
                        <li
                          key={participant.id}
                          className="flex flex-col rounded-xl border border-[#C1272D]/12 p-4 dark:border-white/10"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <EditableParticipantName
                              eventId={id}
                              participantId={participant.id}
                              name={participant.name}
                              username={participant.username}
                            />

                            <div className="flex shrink-0 items-center gap-1">
                              {assignment ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#2F5A43]/12 px-2.5 py-1 text-xs font-semibold text-[#2F5A43] dark:bg-[#2F5A43]/25 dark:text-[#7FcaA0]">
                                  <IconCheck className="h-3 w-3" />
                                  Drawn
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#C1272D]/10 px-2.5 py-1 text-xs font-semibold text-[#C1272D] dark:bg-[#C1272D]/20 dark:text-[#E9B44C]">
                                  <IconClock className="h-3 w-3" />
                                  Waiting
                                </span>
                              )}

                              <DeleteParticipantButton
                                eventId={id}
                                participantId={participant.id}
                                participantName={participant.name}
                                drawsExist={assignedCount > 0}
                              />
                            </div>
                          </div>

                          {/* Access code */}
                          <div className="mt-3 rounded-lg bg-[#FBF3E7] px-3 py-2 dark:bg-[#1A1113]">
                            <p className="text-[11px] uppercase tracking-wider text-[#2A1A14]/45 dark:text-[#EFE6D8]/40">
                              Access code
                            </p>

                            <p className="mt-0.5 font-mono text-sm font-semibold tracking-wider text-[#C1272D] dark:text-[#E9B44C]">
                              {participant.accessCode}
                            </p>
                          </div>

                          {/* Assignment */}
                          <div className="mt-3 border-t border-dashed border-[#C1272D]/15 pt-3 dark:border-white/10">
                            {assignment && assignedParticipant ? (
                              <>
                                <div className="flex items-center gap-2 text-sm">
                                  <IconArrowRight className="h-4 w-4 shrink-0 text-[#2A1A14]/40 dark:text-[#EFE6D8]/40" />
                                  <span className="truncate font-semibold">
                                    {assignedParticipant.name}
                                  </span>
                                </div>

                                <p className="mt-1.5 text-xs text-[#2A1A14]/50 dark:text-[#EFE6D8]/45">
                                  {assignment.createdAt.toLocaleString("en-US", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-[#2A1A14]/40 dark:text-[#EFE6D8]/40">
                                Not drawn yet
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}