import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

/**
 * IP-FORWARD-MIB (1.3.6.1.2.1.4.24)
 * Almacena la tabla de rutas IP del dispositivo.
 */
export const routeTable = pgTable(
  'route',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    dest: varchar('dest', { length: 100 }).notNull(), // ipCidrRouteDest / inetCidrRouteDest
    mask: varchar('mask', { length: 100 }), // ipCidrRouteMask
    pfxLen: integer('pfx_len'), // inetCidrRoutePfxLen
    nextHop: varchar('next_hop', { length: 100 }).notNull(), // ipCidrRouteNextHop / inetCidrRouteNextHop
    ifIndex: integer('if_index'), // ipCidrRouteIfIndex / inetCidrRouteIfIndex
    type: integer('type'), // ipCidrRouteType / inetCidrRouteType
    proto: integer('proto'), // ipCidrRouteProto / inetCidrRouteProto
    age: integer('age'), // ipCidrRouteAge / inetCidrRouteAge
    metric1: integer('metric1'),
    metric2: integer('metric2'),
    metric3: integer('metric3'),
    metric4: integer('metric4'),
    metric5: integer('metric5'),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (t) => [
    uniqueIndex('route_device_dest_hop_idx').on(t.deviceId, t.dest, t.nextHop),
  ],
);
