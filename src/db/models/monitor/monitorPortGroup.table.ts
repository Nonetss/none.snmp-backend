import { pgTable, integer, varchar, boolean } from 'drizzle-orm/pg-core';

// Define grupos de puertos (ej: "Web Services" -> 80, 443)
export const monitorPortGroupTable = pgTable('monitor_port_group', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 500 }),
});

// Puertos específicos dentro de un grupo y su estado esperado
export const monitorPortGroupItemTable = pgTable('monitor_port_group_item', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  portGroupId: integer('port_group_id')
    .notNull()
    .references(() => monitorPortGroupTable.id, { onDelete: 'cascade' }),
  port: integer('port').notNull(),
  expectedStatus: boolean('expected_status').notNull().default(true), // true = abierto, false = cerrado
});
