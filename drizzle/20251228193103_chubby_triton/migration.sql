ALTER TABLE "hr_sw_installed_entry" DROP CONSTRAINT "hr_sw_installed_entry_device_id_device_id_fkey";--> statement-breakpoint
ALTER TABLE "hr_sw_run_entry" DROP CONSTRAINT "hr_sw_run_entry_device_id_device_id_fkey";--> statement-breakpoint
ALTER TABLE "hr_sw_run_perf_entry" DROP CONSTRAINT "hr_sw_run_perf_entry_device_id_device_id_fkey";--> statement-breakpoint
DROP INDEX "device_app_name_idx";--> statement-breakpoint
ALTER TABLE "hr_sw_installed_entry" ADD COLUMN "resource_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hr_sw_run_entry" ADD COLUMN "resource_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hr_sw_run_perf_entry" ADD COLUMN "resource_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hr_sw_installed_entry" DROP COLUMN "device_id";--> statement-breakpoint
ALTER TABLE "hr_sw_run_entry" DROP COLUMN "device_id";--> statement-breakpoint
ALTER TABLE "hr_sw_run_perf_entry" DROP COLUMN "device_id";--> statement-breakpoint
CREATE UNIQUE INDEX "resource_app_name_idx" ON "hr_sw_installed_entry" ("resource_id","hr_sw_installed_name");--> statement-breakpoint
CREATE UNIQUE INDEX "device_resource_unq_idx" ON "resource" ("device_id","name","type");--> statement-breakpoint
ALTER TABLE "hr_sw_installed_entry" ADD CONSTRAINT "hr_sw_installed_entry_resource_id_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id");--> statement-breakpoint
ALTER TABLE "hr_sw_run_entry" ADD CONSTRAINT "hr_sw_run_entry_resource_id_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id");--> statement-breakpoint
ALTER TABLE "hr_sw_run_perf_entry" ADD CONSTRAINT "hr_sw_run_perf_entry_resource_id_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resource"("id");