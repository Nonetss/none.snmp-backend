import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const dnsServerTable = pgTable('dns_server', {
  id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  ip: varchar('ip', { length: 45 }).notNull().unique(),
});
