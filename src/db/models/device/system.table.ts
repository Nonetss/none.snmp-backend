import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

// https://mibbrowser.online/mibdb_search.php?mib=SNMPv2-MIB

export const systemTable = pgTable(
  'system',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    sysDescr: varchar('sys_descr', { length: 255 }), // Indica la descripción del sistema
    sysUpTime: timestamp('sys_up_time', { withTimezone: true }), // Indica el tiempo de actividad del sistema
    sysContact: varchar('sys_contact', { length: 255 }), // Indica el contacto del sistema
    sysName: varchar('sys_name', { length: 255 }), // Indica el nombre del sistema
    sysLocation: varchar('sys_location', { length: 255 }), // Indica la ubicación del sistema
    sysServices: integer('sys_services'), // Indica los servicios del sistema
  },
  (t) => [uniqueIndex('device_system_idx').on(t.deviceId)],
);
