import { pgTable, integer, text, varchar } from 'drizzle-orm/pg-core';

export const metricsDefinitionTable = pgTable('metrics_definition', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  oid: text('oid').notNull(),
  unit: varchar('unit', {
    length: 20,
    enum: [
      'percent',
      'bytes',
      'text',
      'integer',
      'float',
      'date',
      'time',
      'datetime',
    ],
  }),
  priority: integer('priority').notNull().default(0),
  type: varchar('type', { length: 20, enum: ['walk', 'get'] }).notNull(),
});
