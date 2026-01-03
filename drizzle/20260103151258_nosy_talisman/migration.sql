ALTER TABLE "cdp_neighbor" ADD COLUMN "interface_id" integer;--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ADD COLUMN "remote_device_id" integer;--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ADD COLUMN "remote_interface_id" integer;--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ADD CONSTRAINT "cdp_neighbor_interface_id_interface_id_fkey" FOREIGN KEY ("interface_id") REFERENCES "interface"("id");--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ADD CONSTRAINT "cdp_neighbor_remote_device_id_device_id_fkey" FOREIGN KEY ("remote_device_id") REFERENCES "device"("id");--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ADD CONSTRAINT "cdp_neighbor_remote_interface_id_interface_id_fkey" FOREIGN KEY ("remote_interface_id") REFERENCES "interface"("id");