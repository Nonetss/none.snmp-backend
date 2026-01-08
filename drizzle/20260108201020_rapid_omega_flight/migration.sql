ALTER TABLE "notification_action" ADD COLUMN "last_status" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "notification_action" ADD COLUMN "device_aggregation" varchar DEFAULT 'any' NOT NULL;--> statement-breakpoint
ALTER TABLE "notification_action" ADD COLUMN "port_aggregation" varchar DEFAULT 'any' NOT NULL;