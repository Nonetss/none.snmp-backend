CREATE TABLE "device_status" (
	"device_id" integer PRIMARY KEY,
	"status" boolean NOT NULL,
	"last_ping" timestamp with time zone,
	"last_ping_up" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "device_status" ADD CONSTRAINT "device_status_device_id_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("id");