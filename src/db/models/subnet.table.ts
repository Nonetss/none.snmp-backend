import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const subnetTable = pgTable('subnet', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  cidr: varchar('cidr', { length: 15 }).notNull(),
  name: varchar('name', { length: 100 }),
});
