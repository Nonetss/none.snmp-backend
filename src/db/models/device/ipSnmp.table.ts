import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db';

export const ipSnmpTable = pgTable('ip_snmp', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  deviceId: integer('device_id')
    .notNull()
    .references(() => deviceTable.id),
});

// https://mibbrowser.online/mibdb_search.php?mib=IP-MIB

// 1.3.6.1.2.1.4.20.1 - ipAddrEntry
export const ipAddrEntryTable = pgTable('ip_addr_entry', {
  ipAdEntAddr: varchar('ip_ad_ent_addr', { length: 20 }).notNull(),
  ipAdEntIfIndex: integer('ip_ad_ent_if_index').notNull(),
  ipAdEntNetMask: varchar('ip_ad_ent_net_mask', { length: 20 }).notNull(),
  ipAdEntBcastAddr: varchar('ip_ad_ent_bcast_addr', { length: 20 }).notNull(),
  ipAdEntReasmMaxSize: integer('ip_ad_ent_reasm_max_size').notNull(),
});

// 1.3.6.1.2.1.4.22.1 - ipNetToMediaTable
export const ipNetToMediaTable = pgTable('ip_net_to_media_table', {
  ipNetToMediaIfIndex: integer('ip_net_to_media_if_index').notNull(),
  ipNetToMediaPhysAddress: varchar('ip_net_to_media_phys_address', {
    length: 20,
  }).notNull(),
  ipNetToMediaNetAddress: varchar('ip_net_to_media_net_address', {
    length: 20,
  }).notNull(),
  ipNetToMediaType: integer('ip_net_to_media_type').notNull(),
});
