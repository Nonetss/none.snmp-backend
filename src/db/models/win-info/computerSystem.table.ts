import { integer, pgTable, varchar, bigint } from 'drizzle-orm/pg-core';
import { centerTable } from '@/db/models/win-info/center.table';

export const computerSystemTable = pgTable('computer_system', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  Name: varchar('name', { length: 256 }).unique(),
  PrimaryOwnerName: varchar('primary_owner_name', { length: 256 }),
  Domain: varchar('domain', { length: 256 }),
  TotalPhysicalMemory: bigint('total_physical_memory', { mode: 'number' }),
  Model: varchar('model', { length: 256 }),
  Manufacturer: varchar('manufacturer', { length: 256 }),
  CenterId: integer('center_id').references(() => centerTable.id),
});
