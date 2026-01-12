import { Handler } from 'hono';
import { db } from '@/core/config';
import { userTable, loginTable, computerSystemTable } from '@/db';
import { eq, desc, sql } from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getComputersByUserHandler: Handler = async (c) => {
  const { username: rawUsername, excel } = c.req.query();
  const username = rawUsername?.toLowerCase();

  // 1. Find the user
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.username, username))
    .limit(1);

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  // 2. Find all unique computers where the user has logged in
  // We want the latest login for each computer
  const subquery = db
    .select({
      computerId: loginTable.ComputerSystemId,
      maxLoginTime: sql`MAX(${loginTable.loginTime})`.as('max_login_time'),
    })
    .from(loginTable)
    .where(eq(loginTable.userId, user.id))
    .groupBy(loginTable.ComputerSystemId)
    .as('last_logins');

  const results = await db
    .select({
      id: computerSystemTable.id,
      name: computerSystemTable.Name,
      model: computerSystemTable.Model,
      lastLoginAt: subquery.maxLoginTime,
    })
    .from(computerSystemTable)
    .innerJoin(subquery, eq(computerSystemTable.id, subquery.computerId))
    .orderBy(desc(subquery.maxLoginTime));

  const computers = results.map((r) => {
    let lastLoginAt = null;
    if (r.lastLoginAt) {
      lastLoginAt =
        r.lastLoginAt instanceof Date
          ? r.lastLoginAt.toISOString()
          : new Date(r.lastLoginAt as string).toISOString();
    }
    return {
      ...r,
      lastLoginAt,
    };
  });

  if (excel === 'true') {
    const flatResult = computers.map((comp) => ({
      username: user.username,
      ...comp,
    }));
    return sendExcel(c, flatResult, `computers_${user.username}`);
  }

  return c.json({
    username: user.username,
    computers,
  });
};
