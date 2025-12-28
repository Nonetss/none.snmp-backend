import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const metricsDefinitionTable = pgTable('metrics_definition', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  oid: varchar('oid', { length: 500 }).notNull(),
  priority: integer('priority').notNull().default(0),
});
