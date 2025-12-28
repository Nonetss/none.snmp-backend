import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { subnetTable, snmpAuthTable } from '@/db';

export const deviceTable = pgTable('device', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  ipv4: varchar('ipv4', { length: 15 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  subnetId: integer('subnet_id')
    .notNull()
    .references(() => subnetTable.id),
  snmpAuthId: integer('snmp_auth_id').references(() => snmpAuthTable.id),
});
