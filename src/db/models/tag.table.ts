import { pgTable, integer, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { deviceTable } from '@/db/models/device/device.table';

export const tagTable = pgTable('tag', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 7 }), // Hex color (ej: #FF5733)
});

export const deviceTagTable = pgTable(
  'device_tag',
  {
    deviceId: integer('device_id')
      .notNull()
      .references(() => deviceTable.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tagTable.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.deviceId, t.tagId] })],
);
