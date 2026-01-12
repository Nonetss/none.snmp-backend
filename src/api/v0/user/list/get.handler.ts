import { Handler } from 'hono';
import { db } from '@/core/config';
import { userTable } from '@/db';

export const getUserListHandler: Handler = async (c) => {
  const users = await db.select().from(userTable);
  return c.json(users);
};
