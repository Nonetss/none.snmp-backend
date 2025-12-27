// En tu schema.ts
import { pgTable, integer, text, varchar } from 'drizzle-orm/pg-core';

export const metricsDefinitionTable = pgTable('metrics_definition', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  oid: text('oid').notNull(),
  unit: varchar('unit', { length: 20 }),
});
