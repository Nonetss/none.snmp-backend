CREATE TABLE "metrics_definition" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "metrics_definition_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"oid" text NOT NULL,
	"unit" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "snmp_data" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "snmp_data_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"time" timestamp with time zone NOT NULL,
	"device_id" integer NOT NULL,
	"metric_id" integer NOT NULL,
	"value" double precision NOT NULL
);
--> statement-breakpoint
ALTER TABLE "snmp" RENAME TO "snmp_auth";--> statement-breakpoint
ALTER TABLE "snmp_data" ADD CONSTRAINT "snmp_data_device_id_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("id");--> statement-breakpoint
ALTER TABLE "snmp_data" ADD CONSTRAINT "snmp_data_metric_id_metrics_definition_id_fkey" FOREIGN KEY ("metric_id") REFERENCES "metrics_definition"("id");