import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const npmAuthTable = pgTable('npm_auth', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  url: varchar('url').notNull(),
  username: varchar('username').notNull(),
  password: varchar('password').notNull(),
});
