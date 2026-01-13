import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';

export const pangolinAuthTable = pgTable('pangolin_auth', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  url: varchar('url').notNull(),
  token: varchar('token').notNull(),
});

export const pangolinOrgTable = pgTable('pangolin_org', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name').notNull().unique(),
  slug: varchar('slug').notNull().unique(),
  authId: integer('auth_id')
    .notNull()
    .references(() => pangolinAuthTable.id),
});
