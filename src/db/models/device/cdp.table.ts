import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';
import { interfaceTable } from '@/db/models/device/interface.table';

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

    // Relación con la interfaz local
    interfaceId: integer('interface_id')
      .references(() => interfaceTable.id)
      .notNull(),

    // Información del vecino (Cisco MIB)
    cdpCacheAddress: varchar('cdp_cache_address', { length: 100 }), // cdpCacheAddress (IP de gestión)
    cdpCacheDeviceId: varchar('cdp_cache_device_id', { length: 255 }), // cdpCacheDeviceId (ID del equipo vecino)
    cdpCacheDevicePort: varchar('cdp_cache_device_port', { length: 255 }), // cdpCacheDevicePort (Puerto del vecino)
    cdpCachePlatform: varchar('cdp_cache_platform', { length: 255 }), // cdpCachePlatform (Plataforma hardware)
    cdpCacheCapabilities: varchar('cdp_cache_capabilities', { length: 255 }), // cdpCacheCapabilities
    cdpCacheSysName: varchar('cdp_cache_sys_name', { length: 255 }), // cdpCacheSysName (Nombre de sistema)

    // Resolución de Topología
    remoteDeviceId: integer('remote_device_id').references(
      () => deviceTable.id,
    ),
    remoteInterfaceId: integer('remote_interface_id').references(
      () => interfaceTable.id,
    ),

    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('cdp_neighbor_device_if_idx').on(t.deviceId, t.interfaceId),
  ],
);
