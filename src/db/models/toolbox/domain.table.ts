import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const domainTable = pgTable('domain', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  domain: varchar('domain', { length: 100 }).notNull().unique(),
});
