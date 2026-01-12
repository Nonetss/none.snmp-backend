import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';
import { interfaceTable } from '@/db/models/device/interface.table';

export const networkIdentityTable = pgTable('network_identity', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  Description: varchar('description', { length: 256 }),
  MACAddress: varchar('mac_address', { length: 256 }),
  IPAddress: varchar('ip_address', { length: 256 }),
  DateId: integer('date_id').references(() => dateTable.id),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
  interfaceId: integer('interface_id').references(() => interfaceTable.id),
});
