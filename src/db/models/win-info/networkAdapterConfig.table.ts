import { integer, pgTable, varchar, boolean } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';

export const networkAdapterConfigTable = pgTable('network_adapter_config', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  ServiceName: varchar('service_name', { length: 256 }),
  DHCPEnabled: boolean('dhcp_enabled'),
  Index: integer('index'),
  Description: varchar('description', { length: 256 }),
  DateId: integer('date_id').references(() => dateTable.id),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
});
