import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';

export const networkIdentityTable = pgTable('network_identity', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  Description: varchar('description', { length: 256 }),
  MACAddress: varchar('mac_address', { length: 256 }),
  IPAddress: varchar('ip_address', { length: 256 }),
  DateId: integer('date_id').references(() => dateTable.id),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
});
