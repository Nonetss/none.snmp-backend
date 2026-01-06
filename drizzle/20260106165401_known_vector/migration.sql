ALTER TABLE "cdp_neighbor" ADD COLUMN "cdp_cache_address" varchar(100);--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ADD COLUMN "cdp_cache_device_id" varchar(255);--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ADD COLUMN "cdp_cache_device_port" varchar(255);--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ADD COLUMN "cdp_cache_platform" varchar(255);--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ADD COLUMN "cdp_cache_capabilities" varchar(255);--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ADD COLUMN "cdp_cache_sys_name" varchar(255);--> statement-breakpoint
ALTER TABLE "cdp_neighbor" DROP COLUMN "if_index";--> statement-breakpoint
ALTER TABLE "cdp_neighbor" DROP COLUMN "neighbor_index";--> statement-breakpoint
ALTER TABLE "cdp_neighbor" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "cdp_neighbor" DROP COLUMN "neighbor_device_id";--> statement-breakpoint
ALTER TABLE "cdp_neighbor" DROP COLUMN "neighbor_port";--> statement-breakpoint
ALTER TABLE "cdp_neighbor" DROP COLUMN "neighbor_platform";--> statement-breakpoint
ALTER TABLE "cdp_neighbor" DROP COLUMN "neighbor_sys_name";--> statement-breakpoint
ALTER TABLE "cdp_neighbor" ALTER COLUMN "interface_id" SET NOT NULL;--> statement-breakpoint
DROP INDEX IF EXISTS "cdp_neighbor_device_if_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "cdp_neighbor_device_if_idx" ON "cdp_neighbor" ("device_id","interface_id");