import {
  pgTable,
  timestamp,
  integer,
  doublePrecision,
} from 'drizzle-orm/pg-core';
import { deviceTable, metricsDefinitionTable } from '@/db';

export const snmpDataTable = pgTable('snmp_data', {
  time: timestamp('time', { withTimezone: true }).notNull(),
  deviceId: integer('device_id')
    .notNull()
    .references(() => deviceTable.id),
  metricId: integer('metric_id')
    .notNull()
    .references(() => metricsDefinitionTable.id),
  value: doublePrecision('value').notNull(),
});
