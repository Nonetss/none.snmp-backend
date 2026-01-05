import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

export const resourceTable = pgTable(
  'resource',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id),
    name: varchar('name', { length: 255 }).notNull(),
    type: varchar('type', { length: 255 }).notNull(),
    value: varchar('value', { length: 255 }).notNull(),
  },
  (t) => [
    uniqueIndex('device_resource_unq_idx').on(t.deviceId, t.name, t.type),
  ],
);

// https://mibbrowser.online/mibdb_search.php?mib=HOST-RESOURCES-MIB

//1.3.6.1.2.1.25.4.2.1 - Software Run
export const hrSWRunEntryTable = pgTable('hr_sw_run_entry', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  resourceId: integer('resource_id')
    .notNull()
    .references(() => resourceTable.id),
  date: timestamp('date', { withTimezone: true }).notNull(),
  hrSWRunIndex: integer('hr_sw_run_index').notNull(),
  hrSWRunName: varchar('hr_sw_run_name', { length: 255 }).notNull(),
  hrSWRunID: varchar('hr_sw_run_id', { length: 255 }).notNull(),
  hrSWRunPath: varchar('hr_sw_run_path', { length: 255 }).notNull(),
  hrSWRunParameters: varchar('hr_sw_run_parameters', { length: 255 }).notNull(),
  hrSWRunType: integer('hr_sw_run_type').notNull(),
  hrSWRunStatus: integer('hr_sw_run_status').notNull(),
});

//1.3.6.1.2.1.25.5.1.1 - Software Run Performance
export const hrSWRunPerfEntryTable = pgTable('hr_sw_run_perf_entry', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  resourceId: integer('resource_id')
    .notNull()
    .references(() => resourceTable.id),
  date: timestamp('date', { withTimezone: true }).notNull(),
  hrSWRunIndex: integer('hr_sw_run_index').notNull(),
  hrSWRunPerfCPU: integer('hr_sw_run_perf_cpu').notNull(),
  hrSWRunPerfMem: integer('hr_sw_run_perf_mem').notNull(),
});

// 1.3.6.1.2.1.25.6.3.1 - Software Installed
export const hrSWInstalledEntryTable = pgTable(
  'hr_sw_installed_entry',
  {
    id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
    resourceId: integer('resource_id')
      .notNull()
      .references(() => resourceTable.id),
    date: timestamp('date', { withTimezone: true }).notNull(),
    hrSWInstalledIndex: integer('hr_sw_installed_index').notNull(),
    hrSWInstalledName: varchar('hr_sw_installed_name', {
      length: 255,
    }).notNull(),
    hrSWInstalledID: varchar('hr_sw_installed_id', { length: 255 }).notNull(),
    hrSWInstalledType: integer('hr_sw_installed_type').notNull(),
    hrSWInstalledDate: timestamp('hr_sw_installed_date', {
      withTimezone: true,
    }).notNull(),
  },
  (t) => [
    // Evita duplicados por nombre de app en el mismo recurso
    uniqueIndex('resource_app_name_idx').on(t.resourceId, t.hrSWInstalledName),
  ],
);
