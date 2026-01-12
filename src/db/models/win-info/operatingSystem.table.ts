import { integer, pgTable, varchar, bigint } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';

export const operatingSystemTable = pgTable('operating_system', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  Caption: varchar('caption', { length: 256 }),
  InstallDate: varchar('install_date', { length: 256 }),
  SystemDirectory: varchar('system_directory', { length: 256 }),
  Organization: varchar('organization', { length: 256 }),
  OSArchitecture: varchar('os_architecture', { length: 256 }),
  BuildNumber: bigint('build_number', { mode: 'number' }),
  RegisteredUser: varchar('registered_user', { length: 256 }),
  SerialNumber: varchar('serial_number', { length: 256 }),
  Version: varchar('version', { length: 256 }),
  DateId: integer('date_id').references(() => dateTable.id),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
});
