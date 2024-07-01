ALTER TABLE "session" ADD COLUMN "passed_two_factor" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "confirmed_two_factor" boolean DEFAULT false NOT NULL;