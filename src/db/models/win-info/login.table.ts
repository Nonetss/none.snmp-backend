import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { computerSystemTable } from '@/db/models/win-info/computerSystem.table';
import { userTable } from '@/db/models/win-info/user.table';

export const loginTable = pgTable('login', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  loginTime: timestamp('login_time', { withTimezone: true }),
  ComputerSystemId: integer('computer_id').references(
    () => computerSystemTable.id,
  ),
  userId: integer('user_id').references(() => userTable.id),
});
