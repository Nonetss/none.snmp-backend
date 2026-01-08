import { pgTable, integer, varchar, text } from 'drizzle-orm/pg-core';
import { notificationActionTable } from '@/db/models/notifications/notification.table';

export const ntfyCredentialTable = pgTable('ntfy_credential', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  baseUrl: varchar('base_url', { length: 256 })
    .notNull()
    .default('https://ntfy.sh'),
  username: varchar('username', { length: 256 }),
  password: varchar('password', { length: 256 }),
  token: varchar('token', { length: 256 }),
});

export const ntfyTopicTable = pgTable('ntfy_topic', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  topic: varchar('topic', { length: 256 }).notNull(),
  credentialId: integer('credential_id')
    .notNull()
    .references(() => ntfyCredentialTable.id, { onDelete: 'cascade' }),
  description: text('description'),
});

export const ntfyActionTable = pgTable('ntfy_action', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  notificationActionId: integer('notification_action_id')
    .notNull()
    .references(() => notificationActionTable.id, { onDelete: 'cascade' }),
  ntfyTopicId: integer('ntfy_topic_id').references(() => ntfyTopicTable.id, {
    onDelete: 'set null',
  }),
  title: varchar('title', { length: 256 }),
  priority: integer('priority'), // 1 a 5
});

export const ntfyActionTagTable = pgTable('ntfy_action_tag', {
  id: integer('id').generatedByDefaultAsIdentity().primaryKey(),
  ntfyActionId: integer('ntfy_action_id')
    .notNull()
    .references(() => ntfyActionTable.id, { onDelete: 'cascade' }),
  tag: varchar('tag', { length: 100 }).notNull(),
});
