import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const komodoAuthTable = pgTable('komodo_auth', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  url: varchar('url').notNull(),
  key: varchar('key').notNull(),
  secret: varchar('secret').notNull(),
});
