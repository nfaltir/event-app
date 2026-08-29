import {
  pgTable,
  text,
  timestamp,
  uuid,
  unique,
  integer,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  description: text("description"),

  status: text("status").notNull().default("active"),

  budget: integer("budget"),

  currency: text("currency").notNull().default("USD"),

  adminCode: text("admin_code").notNull().unique(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Participants

export const participants = pgTable("participants", {
  id: uuid("id").defaultRandom().primaryKey(),

  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  username: text("username"),

  accessCode: text("access_code")
    .notNull()
    .unique(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Secret Santa Assignments

export const secretSantaAssignments = pgTable(
  "secret_santa_assignments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),

    participantId: uuid("participant_id")
      .notNull()
      .references(() => participants.id, { onDelete: "cascade" }),

    assignedParticipantId: uuid("assigned_participant_id")
      .notNull()
      .references(() => participants.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },

  (table) => [
    unique("secret_santa_participant_unique").on(
      table.eventId,
      table.participantId
    ),

    unique("secret_santa_recipient_unique").on(
      table.eventId,
      table.assignedParticipantId
    ),
  ]
);


// Wishlist

export const wishes = pgTable("wishes", {
  id: uuid("id").defaultRandom().primaryKey(),

  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),

  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),

  text: text("text").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});