import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

/**
 * CISCO-CDP-MIB (1.3.6.1.4.1.9.9.23)
 * Almacena información sobre los vecinos descubiertos mediante CDP.
 */
export const cdpNeighborTable = pgTable(
  'cdp_neighbor',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    ifIndex: integer('if_index').notNull(), // cdpCacheIfIndex
    neighborIndex: integer('neighbor_index').notNull(), // cdpCacheDeviceIndex
    address: varchar('address', { length: 100 }), // cdpCacheAddress
    neighborDeviceId: varchar('neighbor_device_id', { length: 255 }), // cdpCacheDeviceId
    neighborPort: varchar('neighbor_port', { length: 255 }), // cdpCacheDevicePort
    neighborPlatform: varchar('neighbor_platform', { length: 255 }), // cdpCachePlatform
    neighborSysName: varchar('neighbor_sys_name', { length: 255 }), // cdpCacheSysName
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('cdp_neighbor_device_if_idx').on(
      t.deviceId,
      t.ifIndex,
      t.neighborIndex,
    ),
  ],
);
