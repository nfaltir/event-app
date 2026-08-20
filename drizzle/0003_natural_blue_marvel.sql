CREATE TABLE "secret_santa_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"participant_id" uuid NOT NULL,
	"assigned_participant_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "secret_santa_participant_unique" UNIQUE("event_id","participant_id"),
	CONSTRAINT "secret_santa_recipient_unique" UNIQUE("event_id","assigned_participant_id")
);
--> statement-breakpoint
ALTER TABLE "secret_santa_assignments" ADD CONSTRAINT "secret_santa_assignments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secret_santa_assignments" ADD CONSTRAINT "secret_santa_assignments_participant_id_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secret_santa_assignments" ADD CONSTRAINT "secret_santa_assignments_assigned_participant_id_participants_id_fk" FOREIGN KEY ("assigned_participant_id") REFERENCES "public"."participants"("id") ON DELETE cascade ON UPDATE no action;