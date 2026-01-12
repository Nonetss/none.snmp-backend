import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';

export const processorTable = pgTable('processor', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  DeviceID: varchar('device_id', { length: 256 }),
  Name: varchar('name', { length: 256 }),
  Caption: varchar('caption', { length: 256 }),
  MaxClockSpeed: varchar('max_clock_speed', { length: 256 }),
  NumberOfCores: integer('number_of_cores'),
  DateId: integer('date_id').references(() => dateTable.id),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
});
