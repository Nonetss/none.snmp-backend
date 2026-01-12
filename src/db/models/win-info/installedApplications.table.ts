import { integer, pgTable, varchar, date } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';

export const installedApplicationsTable = pgTable('installed_applications', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  DisplayName: varchar('display_name', { length: 256 }),
  DisplayVersion: varchar('display_version', { length: 256 }),
  Publisher: varchar('publisher', { length: 256 }),
  InstallDate: date('install_date'),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
  DateId: integer('date_id').references(() => dateTable.id),
});
