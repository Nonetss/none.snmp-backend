import { Handler } from 'hono';
import { db } from '@/core/config';
import { userTable, loginTable } from '@/db';

export const postLoginHandler: Handler = async (c) => {
  const { username: rawUsername, computerName } = await c.req.json();
  const username = rawUsername?.toLowerCase();

  // 1. Get or create User
  let user = await db.query.userTable.findFirst({
    where: {
      username: {
        eq: username,
      },
    },
  });

  if (!user) {
    [user] = await db
      .insert(userTable)
      .values({
        username,
      })
      .returning();
  }

  // 2. Find Computer
  const computer = await db.query.computerSystemTable.findFirst({
    where: {
      Name: {
        eq: computerName,
      },
    },
  });

  if (!computer) {
    return c.json({ status: 'error', message: 'Computer not found' }, 404);
  }

  // 3. Record Login
  const [login] = await db
    .insert(loginTable)
    .values({
      userId: user.id,
      ComputerSystemId: computer.id,
      loginTime: new Date(),
    })
    .returning();

  return c.json({
    status: 'success',
    loginId: login.id,
    userId: user.id,
    computerId: computer.id,
  });
};
