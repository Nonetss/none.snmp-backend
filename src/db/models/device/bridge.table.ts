import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
  text,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

/**
 * dot1dBase (1.3.6.1.2.1.17.1)
 * Información base del Bridge (Switch/Bridge).
 */
export const bridgeBaseTable = pgTable(
  'bridge_base',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    bridgeAddress: varchar('bridge_address', { length: 100 }), // dot1dBaseBridgeAddress (MAC del bridge)
    numPorts: integer('num_ports'), // dot1dBaseNumPorts
    type: integer('type'), // dot1dBaseType
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [uniqueIndex('bridge_base_device_idx').on(t.deviceId)],
);

/**
 * dot1dBasePortTable (1.3.6.1.2.1.17.1.4) & dot1qPortVlanTable (1.3.6.1.2.1.17.7.1.4.5)
 * Mapeo entre puertos lógicos del bridge y los ifIndex físicos, incluyendo VLAN Nativa (PVID).
 */
export const bridgePortTable = pgTable(
  'bridge_port',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    bridgePort: integer('bridge_port').notNull(), // dot1dBasePort
    ifIndex: integer('if_index'), // dot1dBasePortIfIndex
    pvid: integer('pvid'), // dot1qPvid (VLAN Nativa)
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('bridge_port_device_port_idx').on(t.deviceId, t.bridgePort),
  ],
);

/**
 * dot1dTpFdbTable (1.3.6.1.2.1.17.4.3)
 * Tabla de reenvío (Forwarding Database) - Transparente (sin VLAN).
 */
export const bridgeFdbTable = pgTable(
  'bridge_fdb',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    address: varchar('address', { length: 100 }).notNull(), // dot1dTpFdbAddress (MAC detectada)
    port: integer('port').notNull(), // dot1dTpFdbPort
    status: integer('status'), // dot1dTpFdbStatus
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [uniqueIndex('bridge_fdb_device_addr_idx').on(t.deviceId, t.address)],
);

/**
 * dot1qVlanStaticTable (1.3.6.1.2.1.17.7.1.4.3)
 * Inventario de VLANs y sus puertos asociados.
 */
export const vlanTable = pgTable(
  'vlan',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    vlanId: integer('vlan_id').notNull(), // dot1qVlanIndex
    name: varchar('name', { length: 255 }), // dot1qVlanStaticName
    egressPorts: text('egress_ports'), // dot1qVlanStaticEgressPorts (BitMap Hex)
    untaggedPorts: text('untagged_ports'), // dot1qVlanStaticUntaggedPorts
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [uniqueIndex('vlan_device_vlan_idx').on(t.deviceId, t.vlanId)],
);

/**
 * dot1qTpFdbTable (1.3.6.1.2.1.17.7.1.2.2)
 * Tabla de reenvío (Forwarding Database) - VLAN Aware.
 */
export const bridgeFdbQTable = pgTable(
  'bridge_fdb_q',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    vlanId: integer('vlan_id').notNull(), // FdbId o VlanId
    address: varchar('address', { length: 100 }).notNull(), // dot1qTpFdbAddress
    port: integer('port').notNull(), // dot1qTpFdbPort
    status: integer('status'), // dot1qTpFdbStatus
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('bridge_fdb_q_device_vlan_addr_idx').on(
      t.deviceId,
      t.vlanId,
      t.address,
    ),
  ],
);
