import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';

export const baseBoardTable = pgTable('base_board', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  Manufacturer: varchar('manufacturer', { length: 256 }),
  Model: varchar('model', { length: 256 }),
  Name: varchar('name', { length: 256 }),
  SerialNumber: varchar('serial_number', { length: 256 }),
  SKU: varchar('sku', { length: 256 }),
  Product: varchar('product', { length: 256 }),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
  DateId: integer('date_id').references(() => dateTable.id),
});
