CREATE UNIQUE INDEX "ip_addr_entry_idx" ON "ip_addr_entry" ("ip_snmp_id","ip_ad_ent_addr");--> statement-breakpoint
CREATE UNIQUE INDEX "ip_net_media_idx" ON "ip_net_to_media_table" ("ip_snmp_id","ip_net_to_media_if_index","ip_net_to_media_net_address");--> statement-breakpoint
CREATE UNIQUE INDEX "device_ip_snmp_idx" ON "ip_snmp" ("device_id");