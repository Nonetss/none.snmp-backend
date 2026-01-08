import { pgTable, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

// Histórico de resultados de monitorización
export const portStatusTable = pgTable('port_status', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  deviceId: integer('device_id')
    .notNull()
    .references(() => deviceTable.id, { onDelete: 'cascade' }),
  port: integer('port').notNull(),
  status: boolean('status').notNull(), // true = abierto, false = cerrado
  responseTime: integer('response_time'), // en ms
  checkTime: timestamp('check_time').notNull().defaultNow(),
});
