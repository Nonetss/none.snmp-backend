import { Handler } from 'hono';
import { db } from '@/core/config';
import {
  computerSystemTable,
  networkIdentityTable,
  loginTable,
  userTable,
} from '@/db';
import { eq, desc, and } from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getLastLoginHandler: Handler = async (c) => {
  const { name, ip, excel } = c.req.query();

  let computer;

  if (name) {
    const res = await db
      .select()
      .from(computerSystemTable)
      .where(eq(computerSystemTable.Name, name))
      .limit(1);
    computer = res[0];
  } else if (ip) {
    const [identity] = await db
      .select()
      .from(networkIdentityTable)
      .where(eq(networkIdentityTable.IPAddress, ip))
      .limit(1);
    if (identity) {
      const res = await db
        .select()
        .from(computerSystemTable)
        .where(eq(computerSystemTable.id, identity.ComputerSystemId!))
        .limit(1);
      computer = res[0];
    }
  }

  if (!computer) {
    return c.json({ message: 'Computer not found' }, 404);
  }

  const [lastLogin] = await db
    .select({
      computerName: computerSystemTable.Name,
      username: userTable.username,
      loginTime: loginTable.loginTime,
    })
    .from(loginTable)
    .innerJoin(
      computerSystemTable,
      eq(loginTable.ComputerSystemId, computerSystemTable.id),
    )
    .innerJoin(userTable, eq(loginTable.userId, userTable.id))
    .where(eq(loginTable.ComputerSystemId, computer.id))
    .orderBy(desc(loginTable.loginTime))
    .limit(1);

  if (!lastLogin) {
    return c.json(
      { message: 'No login sessions found for this computer' },
      404,
    );
  }

  const result = {
    ...lastLogin,
    loginTime: lastLogin.loginTime?.toISOString() || null,
  };

  if (excel === 'true') {
    return sendExcel(c, [result], 'last_login');
  }

  return c.json(result);
};
