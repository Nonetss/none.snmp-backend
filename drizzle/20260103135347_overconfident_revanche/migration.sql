ALTER TABLE "lldp_neighbor" ADD COLUMN "interface_id" integer;--> statement-breakpoint
ALTER TABLE "lldp_neighbor" ADD COLUMN "mgmt_address" varchar(100);--> statement-breakpoint
ALTER TABLE "lldp_neighbor" ADD COLUMN "remote_device_id" integer;--> statement-breakpoint
ALTER TABLE "lldp_neighbor" ADD COLUMN "remote_interface_id" integer;--> statement-breakpoint
ALTER TABLE "lldp_neighbor" ADD CONSTRAINT "lldp_neighbor_interface_id_interface_id_fkey" FOREIGN KEY ("interface_id") REFERENCES "interface"("id");--> statement-breakpoint
ALTER TABLE "lldp_neighbor" ADD CONSTRAINT "lldp_neighbor_remote_device_id_device_id_fkey" FOREIGN KEY ("remote_device_id") REFERENCES "device"("id");--> statement-breakpoint
ALTER TABLE "lldp_neighbor" ADD CONSTRAINT "lldp_neighbor_remote_interface_id_interface_id_fkey" FOREIGN KEY ("remote_interface_id") REFERENCES "interface"("id");