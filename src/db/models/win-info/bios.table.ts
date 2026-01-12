import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';

export const biosTable = pgTable('bios', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  SMBIOSBIOSVersion: varchar('smbios_bios_version', { length: 256 }),
  Manufacturer: varchar('manufacturer', { length: 256 }),
  Name: varchar('name', { length: 256 }),
  SerialNumber: varchar('serial_number', { length: 256 }),
  Version: varchar('version', { length: 256 }),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
  DateId: integer('date_id').references(() => dateTable.id),
});
