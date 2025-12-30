import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

/**
 * LLDP-MIB (1.0.8802.1.1.2)
 * Almacena información sobre los vecinos descubiertos mediante LLDP.
 */
export const lldpNeighborTable = pgTable(
  'lldp_neighbor',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    localPortNum: integer('local_port_num').notNull(), // lldpRemLocalPortNum
    neighborIndex: integer('neighbor_index').notNull(), // lldpRemIndex
    chassisIdSubtype: integer('chassis_id_subtype'), // lldpRemChassisIdSubtype
    chassisId: varchar('chassis_id', { length: 255 }), // lldpRemChassisId
    portIdSubtype: integer('port_id_subtype'), // lldpRemPortIdSubtype
    portId: varchar('port_id', { length: 255 }), // lldpRemPortId
    portDesc: varchar('port_desc', { length: 255 }), // lldpRemPortDesc
    sysName: varchar('sys_name', { length: 255 }), // lldpRemSysName
    sysDesc: varchar('sys_desc', { length: 1024 }), // lldpRemSysDesc
    sysCapSupported: varchar('sys_cap_supported', { length: 100 }), // lldpRemSysCapSupported (Bits)
    sysCapEnabled: varchar('sys_cap_enabled', { length: 100 }), // lldpRemSysCapEnabled (Bits)
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('lldp_neighbor_device_port_idx').on(
      t.deviceId,
      t.localPortNum,
      t.neighborIndex,
    ),
  ],
);
