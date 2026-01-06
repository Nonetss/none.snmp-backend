import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

export const ipSnmpTable = pgTable(
  'ip_snmp',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
  },
  (t) => [uniqueIndex('device_ip_snmp_idx').on(t.deviceId)],
);

// https://mibbrowser.online/mibdb_search.php?mib=IP-MIB

// 1.3.6.1.2.1.4.20.1 - ipAddrEntry
export const ipAddrEntryTable = pgTable(
  'ip_addr_entry',
  {
    ipSnmpId: integer('ip_snmp_id')
      .notNull()
      .references(() => ipSnmpTable.id),
    time: timestamp('time', { withTimezone: true }).notNull(),
    ipAdEntAddr: varchar('ip_ad_ent_addr', { length: 20 }).notNull(), // Indica la dirección IP de la interfaz
    ipAdEntIfIndex: integer('ip_ad_ent_if_index').notNull(), // Indica el índice de la interfaz
    ipAdEntNetMask: varchar('ip_ad_ent_net_mask', { length: 20 }).notNull(), // Indica la máscara de red de la interfaz
    ipAdEntBcastAddr: varchar('ip_ad_ent_bcast_addr', { length: 20 }).notNull(), // Indica la dirección de broadcast de la interfaz
    ipAdEntReasmMaxSize: integer('ip_ad_ent_reasm_max_size').notNull(), // Indica el tamaño máximo de los paquetes que puede reasemblar la interfaz
  },
  (t) => [uniqueIndex('ip_addr_entry_idx').on(t.ipSnmpId, t.ipAdEntAddr)],
);

// 1.3.6.1.2.1.4.22.1 - ipNetToMediaTable
export const ipNetToMediaTable = pgTable(
  'ip_net_to_media_table',
  {
    ipSnmpId: integer('ip_snmp_id')
      .notNull()
      .references(() => ipSnmpTable.id),
    time: timestamp('time', { withTimezone: true }).notNull(),
    ipNetToMediaIfIndex: integer('ip_net_to_media_if_index').notNull(), // Indica el índice de la interfaz
    ipNetToMediaPhysAddress: varchar('ip_net_to_media_phys_address', {
      length: 20,
    }).notNull(), // Indica la dirección física de la interfaz
    ipNetToMediaNetAddress: varchar('ip_net_to_media_net_address', {
      length: 20,
    }).notNull(), // Indica la dirección de red de la interfaz
    ipNetToMediaType: integer('ip_net_to_media_type').notNull(), // Indica el tipo de la interfaz
  },
  (t) => [
    uniqueIndex('ip_net_media_idx').on(
      t.ipSnmpId,
      t.ipNetToMediaIfIndex,
      t.ipNetToMediaNetAddress,
    ),
  ],
);
