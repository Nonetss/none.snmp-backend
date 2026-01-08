import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { subnetTable } from '@/db/models/subnet.table';
import { snmpAuthTable } from '@/db/models/snmpAuth.table';
import { locationTable } from '@/db/models/location.table';

export const deviceTable = pgTable('device', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  ipv4: varchar('ipv4', { length: 15 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  subnetId: integer('subnet_id')
    .notNull()
    .references(() => subnetTable.id),
  snmpAuthId: integer('snmp_auth_id').references(() => snmpAuthTable.id),
  locationId: integer('location_id').references(() => locationTable.id),
});
