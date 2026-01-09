import { pgTable, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';
import { monitorRuleTable } from '@/db/models/monitor/monitorRule.table';
import { monitorPortGroupItemTable } from '@/db/models/monitor/monitorPortGroup.table';

// Histórico de resultados de monitorización
export const portStatusTable = pgTable('port_status', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  ruleId: integer('rule_id').references(() => monitorRuleTable.id, {
    onDelete: 'cascade',
  }),
  portGroupItemId: integer('port_group_item_id').references(
    () => monitorPortGroupItemTable.id,
    { onDelete: 'set null' },
  ),
  deviceId: integer('device_id')
    .notNull()
    .references(() => deviceTable.id, { onDelete: 'cascade' }),
  port: integer('port').notNull(),
  status: boolean('status').notNull(), // true = abierto, false = cerrado
  responseTime: integer('response_time'), // en ms
  checkTime: timestamp('check_time').notNull().defaultNow(),
});
