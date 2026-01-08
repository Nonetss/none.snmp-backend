ALTER TABLE "port_status" ADD COLUMN "rule_id" integer;--> statement-breakpoint
ALTER TABLE "port_status" ADD COLUMN "port_group_item_id" integer;--> statement-breakpoint
ALTER TABLE "port_status" ADD CONSTRAINT "port_status_rule_id_monitor_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "monitor_rule"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "port_status" ADD CONSTRAINT "port_status_port_group_item_id_monitor_port_group_item_id_fkey" FOREIGN KEY ("port_group_item_id") REFERENCES "monitor_port_group_item"("id") ON DELETE SET NULL;