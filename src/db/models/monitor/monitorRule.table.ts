import {
  pgTable,
  integer,
  varchar,
  boolean,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';
import { monitorGroupTable } from '@/db/models/monitor/monitorGroup.table';
import { monitorPortGroupTable } from '@/db/models/monitor/monitorPortGroup.table';

// Une un grupo de dispositivos con un grupo de puertos para monitorizar
export const monitorRuleTable = pgTable('monitor_rule', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  deviceGroupId: integer('device_group_id')
    .notNull()
    .references(() => monitorGroupTable.id, { onDelete: 'cascade' }),
  portGroupId: integer('port_group_id')
    .notNull()
    .references(() => monitorPortGroupTable.id, { onDelete: 'cascade' }),
  enabled: boolean('enabled').notNull().default(true),

  // Campos de programación (Scheduler integrado)
  cronExpression: varchar('cron_expression', { length: 100 })
    .notNull()
    .default('*/5 * * * *'),
  lastRun: timestamp('last_run', { withTimezone: true }),
  nextRun: timestamp('next_run', { withTimezone: true }),
  status: varchar('status', { length: 20 }).default('idle'), // 'idle', 'running', 'error'
  lastResult: text('last_result'),

  // Configuración de notificaciones
  condition: varchar('condition', {
    enum: ['down', 'up', 'change', 'always'],
  })
    .notNull()
    .default('down'),
});
