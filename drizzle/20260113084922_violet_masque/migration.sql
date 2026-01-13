CREATE TABLE "dns_server" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dns_server_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL UNIQUE,
	"ip" varchar(45) NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "domain" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "domain_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"domain" varchar(100) NOT NULL UNIQUE
);
