ALTER TABLE "user_profile_picture" RENAME COLUMN "id" TO "user_id";--> statement-breakpoint
ALTER TABLE "user_profile_picture" DROP CONSTRAINT "user_profile_picture_id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profile_picture" ADD CONSTRAINT "user_profile_picture_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
