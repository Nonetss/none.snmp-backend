import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  username: varchar('username', { length: 256 }).unique(),
});
