import { db } from "@/db";
import { events, participants, wishes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { formatMoney } from "@/lib/money";
import { addWish, deleteWish } from "./actions";
import DeleteWishButton from "./DeleteWishButton";

const MAX_WISHES = 3;

function IconGift({ className = "" }: { className?: string }) {
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
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function IconArrowLeft({ className = "" }: { className?: string }) {
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
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function IconSparkle({ className = "" }: { className?: string }) {
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
      <path d="M12 3l1.9 5.8L20 10l-5.8 1.9L12 18l-1.9-5.8L4 10l5.8-1.9z" />
    </svg>
  );
}

type WishlistPageProps = {
  params: Promise<{ id: string }>;
};

export default async function WishlistPage({ params }: WishlistPageProps) {
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

  const me = await db.query.participants.findFirst({
    where: and(
      eq(participants.id, participantId),
      eq(participants.eventId, id)
    ),
  });

  if (!me) {
    redirect(`/events/${id}/join`);
  }

  // Everyone in the event, and all wishes for the event.
  const eventParticipants = await db
    .select()
    .from(participants)
    .where(eq(participants.eventId, id));

  const allWishes = await db
    .select()
    .from(wishes)
    .where(eq(wishes.eventId, id));

  // Group wishes by participant.
  const wishesByParticipant = new Map<string, typeof allWishes>();
  for (const w of allWishes) {
    const list = wishesByParticipant.get(w.participantId) ?? [];
    list.push(w);
    wishesByParticipant.set(w.participantId, list);
  }

  const myWishes = wishesByParticipant.get(me.id) ?? [];
  const atLimit = myWishes.length >= MAX_WISHES;

  // Board: everyone else (put me first for convenience).
  const others = eventParticipants.filter((p) => p.id !== me.id);

  return (
    <div className="min-h-screen bg-[#FBF3E7] text-[#2A1A14] dark:bg-[#1A1113] dark:text-[#EFE6D8]">
      <AppHeader />

      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-2xl">
          {/* Back to reveal */}
          <Link
            href={`/events/${id}/secret-santa`}
            className="inline-flex items-center gap-1.5 text-sm text-[#2A1A14]/60 transition-colors hover:text-[#C1272D] dark:text-[#EFE6D8]/60 dark:hover:text-[#E9B44C]"
          >
            <IconArrowLeft className="h-4 w-4" />
            Back to my draw
          </Link>

          {/* Heading */}
          <div className="mt-4 text-center">
            <p className="font-(family-name:--font-script) text-2xl text-[#C1272D] dark:text-[#E9B44C]">
              Wishlist
            </p>
            <h1 className="mt-1 font-(family-name:--font-display) text-3xl font-semibold sm:text-4xl">
              {event.name}
            </h1>
            {event.budget != null ? (
              <p className="mx-auto mt-2 inline-flex items-center gap-1 rounded-full bg-[#2F5A43]/12 px-3 py-1 text-sm font-semibold text-[#2F5A43] dark:bg-[#2F5A43]/25 dark:text-[#7FcaA0]">
                Budget {formatMoney(event.budget, event.currency)}
              </p>
            ) : null}
          </div>

          {/* My wishes */}
          <section className="mt-8 rounded-3xl border border-[#C1272D]/15 bg-white p-6 shadow-[0_12px_40px_-16px_rgba(193,39,45,0.2)] dark:border-white/10 dark:bg-[#241719]">
            <div className="flex items-center gap-2">
              <IconSparkle className="h-5 w-5 text-[#C1272D] dark:text-[#E9B44C]" />
              <h2 className="font-(family-name:--font-display) text-lg font-semibold">
                Your wishes
              </h2>
              <span className="ml-auto text-xs font-semibold text-[#2A1A14]/45 dark:text-[#EFE6D8]/40">
                {myWishes.length} / {MAX_WISHES}
              </span>
            </div>

            <p className="mt-1 text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/50">
              Add up to {MAX_WISHES} ideas to help your Secret Santa. Keep it
              within the budget!
            </p>

            {/* Existing wishes */}
            {myWishes.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {myWishes.map((w) => (
                  <li
                    key={w.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#C1272D]/12 bg-[#FBF3E7] px-4 py-3 dark:border-white/10 dark:bg-[#1A1113]"
                  >
                    <span className="min-w-0 flex-1 wrap-break-words text-sm">
                      {w.text}
                    </span>
                    <DeleteWishButton eventId={id} wishId={w.id} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-[#C1272D]/20 px-4 py-6 text-center text-sm text-[#2A1A14]/50 dark:border-white/15 dark:text-[#EFE6D8]/40">
                No wishes yet — add your first below.
              </p>
            )}

            {/* Add form */}
            {!atLimit ? (
              <form
                action={async (formData) => {
                  "use server";
                  await addWish(id, formData);
                }}
                className="mt-4 flex items-center gap-2"
              >
                <input
                  name="text"
                  type="text"
                  required
                  maxLength={200}
                  placeholder="e.g. cozy wool socks, a good coffee mug…"
                  className="w-full rounded-xl border border-[#C1272D]/20 bg-white px-4 py-2.5 text-sm text-[#2A1A14] outline-none focus:border-[#C1272D] focus:ring-2 focus:ring-[#C1272D]/15 dark:border-white/15 dark:bg-[#1A1113] dark:text-white dark:focus:border-[#E9B44C] dark:focus:ring-[#E9B44C]/15"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#C1272D] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#8E1D22]"
                >
                  Add
                </button>
              </form>
            ) : (
              <p className="mt-4 text-center text-xs font-semibold text-[#2A1A14]/45 dark:text-[#EFE6D8]/40">
                You&apos;ve added the maximum of {MAX_WISHES} wishes. Remove one
                to add another.
              </p>
            )}
          </section>

          {/* Everyone's board */}
          <section className="mt-8">
            <div className="flex items-center gap-2">
              <IconGift className="h-5 w-5 text-[#C1272D] dark:text-[#E9B44C]" />
              <h2 className="font-(family-name:--font-display) text-lg font-semibold">
                Everyone&apos;s wishlist
              </h2>
            </div>

            <p className="mt-1 text-sm text-[#2A1A14]/60 dark:text-[#EFE6D8]/50">
              Browse what everyone would love. (Who you drew stays secret!)
            </p>

            {others.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-[#C1272D]/20 px-4 py-6 text-center text-sm text-[#2A1A14]/50 dark:border-white/15 dark:text-[#EFE6D8]/40">
                No one else has joined yet.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {others.map((p) => {
                  const theirWishes = wishesByParticipant.get(p.id) ?? [];
                  return (
                    <li
                      key={p.id}
                      className="rounded-2xl border border-[#C1272D]/12 bg-white p-5 dark:border-white/10 dark:bg-[#241719]"
                    >
                      <div className="flex items-baseline gap-2">
                        <p className="font-(family-name:--font-display) font-semibold">
                          {p.name}
                        </p>
                        {p.username ? (
                          <span className="text-sm text-[#2A1A14]/45 dark:text-[#EFE6D8]/40">
                            @{p.username}
                          </span>
                        ) : null}
                      </div>

                      {theirWishes.length > 0 ? (
                        <ul className="mt-3 space-y-1.5">
                          {theirWishes.map((w) => (
                            <li
                              key={w.id}
                              className="flex items-start gap-2 text-sm text-[#2A1A14]/80 dark:text-[#EFE6D8]/70"
                            >
                              <IconSparkle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E9B44C]" />
                              <span className="wrap-break-words">{w.text}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm italic text-[#2A1A14]/40 dark:text-[#EFE6D8]/35">
                          No wishes yet.
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}