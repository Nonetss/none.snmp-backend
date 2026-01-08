import { pgTable, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { monitorGroupTable } from './monitorGroup.table';
import { monitorPortGroupTable } from './monitorPortGroup.table';

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
});
