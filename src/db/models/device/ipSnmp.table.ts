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
  ipAdEntAddr: varchar('ip_ad_ent_addr', { length: 20 }).notNull(), // Indica la dirección IP de la interfaz
  ipAdEntIfIndex: integer('ip_ad_ent_if_index').notNull(), // Indica el índice de la interfaz
  ipAdEntNetMask: varchar('ip_ad_ent_net_mask', { length: 20 }).notNull(), // Indica la máscara de red de la interfaz
  ipAdEntBcastAddr: varchar('ip_ad_ent_bcast_addr', { length: 20 }).notNull(), // Indica la dirección de broadcast de la interfaz
  ipAdEntReasmMaxSize: integer('ip_ad_ent_reasm_max_size').notNull(), // Indica el tamaño máximo de los paquetes que puede reasemblar la interfaz
});

// 1.3.6.1.2.1.4.22.1 - ipNetToMediaTable
export const ipNetToMediaTable = pgTable('ip_net_to_media_table', {
  ipNetToMediaIfIndex: integer('ip_net_to_media_if_index').notNull(), // Indica el índice de la interfaz
  ipNetToMediaPhysAddress: varchar('ip_net_to_media_phys_address', {
    length: 20,
  }).notNull(), // Indica la dirección física de la interfaz
  ipNetToMediaNetAddress: varchar('ip_net_to_media_net_address', {
    length: 20,
  }).notNull(), // Indica la dirección de red de la interfaz
  ipNetToMediaType: integer('ip_net_to_media_type').notNull(), // Indica el tipo de la interfaz
});
