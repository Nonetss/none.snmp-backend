ALTER TABLE "hikvision" ALTER COLUMN "mac_addr" SET DATA TYPE varchar(255) USING "mac_addr"::varchar(255);--> statement-breakpoint
ALTER TABLE "hikvision" ALTER COLUMN "dyn_ip_addr" SET DATA TYPE varchar(64) USING "dyn_ip_addr"::varchar(64);--> statement-breakpoint
ALTER TABLE "hikvision" ALTER COLUMN "dyn_net_mask" SET DATA TYPE varchar(64) USING "dyn_net_mask"::varchar(64);--> statement-breakpoint
ALTER TABLE "hikvision" ALTER COLUMN "dyn_gateway" SET DATA TYPE varchar(64) USING "dyn_gateway"::varchar(64);--> statement-breakpoint
ALTER TABLE "hikvision" ALTER COLUMN "static_ip_addr" SET DATA TYPE varchar(64) USING "static_ip_addr"::varchar(64);--> statement-breakpoint
ALTER TABLE "hikvision" ALTER COLUMN "static_net_mask" SET DATA TYPE varchar(64) USING "static_net_mask"::varchar(64);--> statement-breakpoint
ALTER TABLE "hikvision" ALTER COLUMN "static_gateway" SET DATA TYPE varchar(64) USING "static_gateway"::varchar(64);--> statement-breakpoint
ALTER TABLE "hikvision" ALTER COLUMN "manage_serv_addr" SET DATA TYPE varchar(64) USING "manage_serv_addr"::varchar(64);