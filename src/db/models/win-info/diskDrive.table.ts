import {
  integer,
  pgTable,
  varchar,
  numeric,
  bigint,
} from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { dateTable } from '@/db/models/win-info/date.table';

export const diskDriveTable = pgTable('disk_drive', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  DeviceID: varchar('device_id', { length: 256 }),
  Caption: varchar('caption', { length: 256 }),
  Partitions: numeric('partitions', { mode: 'number' }),
  Size: bigint('size', { mode: 'number' }),
  Model: varchar('model', { length: 256 }),
  ComputerSystemId: integer('computer_system_id').references(
    () => computerSystemTable.id,
  ),
  DateId: integer('date_id').references(() => dateTable.id),
});
