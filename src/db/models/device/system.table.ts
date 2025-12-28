import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db';

export const systemTable = pgTable('system', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  deviceId: integer('device_id')
    .notNull()
    .references(() => deviceTable.id),
  sysDescr: varchar('sys_descr', { length: 255 }),
  sysUpTime: timestamp('sys_up_time', { withTimezone: true }),
  sysContact: varchar('sys_contact', { length: 255 }),
  sysName: varchar('sys_name', { length: 255 }),
  sysLocation: varchar('sys_location', { length: 255 }),
  sysServices: integer('sys_services'),
});
