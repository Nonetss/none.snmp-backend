import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const centerTable = pgTable('center', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  Name: varchar('name', { length: 256 }),
  ipRange: varchar('ip_range', { length: 256 }).unique(),
});
