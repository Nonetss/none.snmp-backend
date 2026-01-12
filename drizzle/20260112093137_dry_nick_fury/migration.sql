ALTER TABLE "computer_system" DROP CONSTRAINT "computer_system_center_id_center_id_fkey";--> statement-breakpoint
DROP TABLE "center";--> statement-breakpoint
ALTER TABLE "computer_system" DROP COLUMN "center_id";