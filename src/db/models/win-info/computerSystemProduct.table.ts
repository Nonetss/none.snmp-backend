import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';

export const computerSystemProductTable = pgTable('computer_system_product', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  IdentifyingNumber: varchar('identifying_number', { length: 256 }),
  Name: varchar('name', { length: 256 }),
  Vendor: varchar('vendor', { length: 256 }),
  Version: varchar('version', { length: 256 }),
  Caption: varchar('caption', { length: 256 }),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
  DateId: integer('date_id').references(() => dateTable.id),
});
