import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const locationTable = pgTable('location', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: varchar('description', { length: 500 }),
  parentId: integer('parent_id').references((): any => locationTable.id),
});
