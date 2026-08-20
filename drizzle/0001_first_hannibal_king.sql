ALTER TABLE "events" ADD COLUMN "admin_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_admin_code_unique" UNIQUE("admin_code");