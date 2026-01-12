import { Handler } from 'hono';
import { db } from '@/core/config';
import { userTable } from '@/db';
import { sendExcel } from '@/lib/excel';

export const getUserListHandler: Handler = async (c) => {
  const { excel } = c.req.query();
  const users = await db.select().from(userTable);

  if (excel === 'true') {
    return sendExcel(c, users, 'users');
  }

  return c.json(users);
};
