import {
  pgTable,
  varchar,
  integer,
  timestamp,
  boolean,
  text,
} from 'drizzle-orm/pg-core';

export const taskScheduleTable = pgTable('task_schedule', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'SCAN_SUBNET', 'POLL_ALL', 'POLL_DEVICE'
  targetId: integer('target_id'), // ID of subnet or device
  cronExpression: varchar('cron_expression', { length: 100 }).notNull(), // e.g. '0 * * * *' (hourly)
  enabled: boolean('enabled').default(true).notNull(),
  lastRun: timestamp('last_run', { withTimezone: true }),
  nextRun: timestamp('next_run', { withTimezone: true }),
  status: varchar('status', { length: 20 }).default('idle'), // 'idle', 'running', 'error'
  lastResult: text('last_result'),
});
