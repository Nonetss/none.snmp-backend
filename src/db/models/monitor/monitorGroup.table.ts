import {
  pgTable,
  integer,
  varchar,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

// Define grupos lógicos de dispositivos
export const monitorGroupTable = pgTable('monitor_group', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 500 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relación N:N entre grupos y dispositivos
export const monitorGroupDeviceTable = pgTable(
  'monitor_group_device',
  {
    groupId: integer('group_id')
      .notNull()
      .references(() => monitorGroupTable.id, { onDelete: 'cascade' }),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.deviceId] })],
);
