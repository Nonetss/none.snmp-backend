import { pgTable, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

export const deviceStatusTable = pgTable('device_status', {
  deviceId: integer('device_id')
    .primaryKey()
    .references(() => deviceTable.id),
  status: boolean('status').notNull(),
  lastPing: timestamp('last_ping', { withTimezone: true }),
  lastPingUp: timestamp('last_ping_up', { withTimezone: true }),
});
