import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  description: text("description"),

  status: text("status").notNull().default("active"),

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