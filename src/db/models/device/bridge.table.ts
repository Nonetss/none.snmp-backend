import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
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
 * dot1dBasePortTable (1.3.6.1.2.1.17.1.4)
 * Mapeo entre puertos lógicos del bridge y los ifIndex físicos.
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
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('bridge_port_device_port_idx').on(t.deviceId, t.bridgePort),
  ],
);

/**
 * dot1dTpFdbTable (1.3.6.1.2.1.17.4.3)
 * Tabla de reenvío (Forwarding Database).
 * Mapea direcciones MAC detectadas a puertos del bridge.
 */
export const bridgeFdbTable = pgTable(
  'bridge_fdb',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    address: varchar('address', { length: 100 }).notNull(), // dot1dTpFdbAddress (MAC detectada)
    port: integer('port').notNull(), // dot1dTpFdbPort (Puerto del bridge donde se vio)
    status: integer('status'), // dot1dTpFdbStatus (learned, self, etc.)
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [uniqueIndex('bridge_fdb_device_addr_idx').on(t.deviceId, t.address)],
);
