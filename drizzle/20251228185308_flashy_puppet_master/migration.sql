ALTER TABLE "hr_sw_installed_entry" ADD COLUMN "device_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hr_sw_run_entry" ADD COLUMN "device_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hr_sw_run_perf_entry" ADD COLUMN "device_id" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "device_app_name_idx" ON "hr_sw_installed_entry" ("device_id","hr_sw_installed_name");--> statement-breakpoint
ALTER TABLE "hr_sw_installed_entry" ADD CONSTRAINT "hr_sw_installed_entry_device_id_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("id");--> statement-breakpoint
ALTER TABLE "hr_sw_run_entry" ADD CONSTRAINT "hr_sw_run_entry_device_id_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("id");--> statement-breakpoint
ALTER TABLE "hr_sw_run_perf_entry" ADD CONSTRAINT "hr_sw_run_perf_entry_device_id_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("id");