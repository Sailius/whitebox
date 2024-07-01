ALTER TABLE "user_profile_picture" ALTER COLUMN "color_1" SET DEFAULT '#888888ff';--> statement-breakpoint
ALTER TABLE "user_profile_picture" ADD COLUMN "color_2" text DEFAULT '#00000000' NOT NULL;