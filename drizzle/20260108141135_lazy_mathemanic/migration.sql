ALTER TABLE "monitor_rule" ADD COLUMN "cron_expression" varchar(100) DEFAULT '*/5 * * * *' NOT NULL;--> statement-breakpoint
ALTER TABLE "monitor_rule" ADD COLUMN "last_run" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "monitor_rule" ADD COLUMN "next_run" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "monitor_rule" ADD COLUMN "status" varchar(20) DEFAULT 'idle';--> statement-breakpoint
ALTER TABLE "monitor_rule" ADD COLUMN "last_result" text;