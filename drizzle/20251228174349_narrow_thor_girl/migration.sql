ALTER TABLE "interface_data" ALTER COLUMN "if_in_octets" SET DATA TYPE numeric USING "if_in_octets"::numeric;--> statement-breakpoint
ALTER TABLE "interface_data" ALTER COLUMN "if_out_octets" SET DATA TYPE numeric USING "if_out_octets"::numeric;--> statement-breakpoint
ALTER TABLE "interface" ALTER COLUMN "if_speed" SET DATA TYPE numeric USING "if_speed"::numeric;