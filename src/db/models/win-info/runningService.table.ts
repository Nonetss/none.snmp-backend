import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';

export const runningServicesTable = pgTable('running_service', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  Name: varchar('name', { length: 256 }),
  DisplayName: varchar('display_name', { length: 256 }),
  Status: varchar('status', { length: 256 }),
  StartType: varchar('start_type', { length: 256 }),
  DateId: integer('date_id').references(() => dateTable.id),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
});
