ALTER TABLE "snmp_auth" ALTER COLUMN "v3_user" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "snmp_auth" ALTER COLUMN "v3_auth_protocol" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "snmp_auth" ALTER COLUMN "v3_auth_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "snmp_auth" ALTER COLUMN "v3_priv_protocol" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "snmp_auth" ALTER COLUMN "v3_priv_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "snmp_auth" ALTER COLUMN "v3_level" DROP NOT NULL;