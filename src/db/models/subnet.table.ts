import { pgTable, varchar, integer, boolean } from 'drizzle-orm/pg-core';

export const subnetTable = pgTable('subnet', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  cidr: varchar('cidr', { length: 50 }).notNull(),
  name: varchar('name', { length: 100 }),
  scanPingable: boolean('scan_pingable').default(false),
});
