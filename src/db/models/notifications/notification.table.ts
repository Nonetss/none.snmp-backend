import {
  pgTable,
  integer,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { monitorRuleTable } from '@/db/models/monitor/monitorRule.table';

export const notificationActionTable = pgTable('notification_action', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  monitorRuleId: integer('monitor_rule_id')
    .notNull()
    .references(() => monitorRuleTable.id, { onDelete: 'cascade' }),
  enabled: boolean('enabled').notNull().default(true),
  type: varchar('type', { enum: ['ntfy', 'email'] }).notNull(),

  // Condiciones de disparo
  consecutiveFailures: integer('consecutive_failures').default(1), // nº de fallos seguidos para avisar
  repeatIntervalMins: integer('repeat_interval_mins').default(60), // cada cuánto repetir si sigue mal
  lastSentAt: timestamp('last_sent_at', { withTimezone: true }),
  lastStatus: boolean('last_status').default(true), // true = ok, false = failing

  // Agregación
  deviceAggregation: varchar('device_aggregation', {
    enum: ['any', 'all', 'percentage'],
  })
    .notNull()
    .default('any'),
  deviceAggregationValue: integer('device_aggregation_value').default(0),
  portAggregation: varchar('port_aggregation', {
    enum: ['any', 'all', 'percentage'],
  })
    .notNull()
    .default('any'),
  portAggregationValue: integer('port_aggregation_value').default(0),
});
