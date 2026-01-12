import { integer, pgTable, date } from 'drizzle-orm/pg-core';

export const dateTable = pgTable('date', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  date: date('date').defaultNow().unique(),
});
