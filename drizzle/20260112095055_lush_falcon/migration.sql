ALTER TABLE "computer_system" ADD COLUMN "device_id" integer;--> statement-breakpoint
ALTER TABLE "network_identity" ADD COLUMN "interface_id" integer;--> statement-breakpoint
ALTER TABLE "computer_system" ADD CONSTRAINT "computer_system_device_id_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("id");--> statement-breakpoint
ALTER TABLE "network_identity" ADD CONSTRAINT "network_identity_interface_id_interface_id_fkey" FOREIGN KEY ("interface_id") REFERENCES "interface"("id");