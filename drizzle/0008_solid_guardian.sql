CREATE TABLE IF NOT EXISTS "user_profile_picture" (
	"id" text PRIMARY KEY NOT NULL,
	"angle" smallint DEFAULT 45 NOT NULL,
	"color_1" text DEFAULT '#00000000' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profile_picture" ADD CONSTRAINT "user_profile_picture_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
