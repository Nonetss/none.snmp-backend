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

export const getLoginHistoryHandler: Handler = async (c) => {
  const { name, ip, excel } = c.req.valid('query' as any);

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

  const history = await db
    .select({
      username: userTable.username,
      loginTime: loginTable.loginTime,
    })
    .from(loginTable)
    .innerJoin(userTable, eq(loginTable.userId, userTable.id))
    .where(eq(loginTable.ComputerSystemId, computer.id))
    .orderBy(desc(loginTable.loginTime));

  const result = {
    computerName: computer.Name,
    history: history.map((h) => ({
      ...h,
      loginTime: h.loginTime?.toISOString() || null,
    })),
  };

  if (excel === 'true') {
    const flatResult = result.history.map((h) => ({
      computerName: result.computerName,
      ...h,
    }));
    return sendExcel(c, flatResult, 'login_history');
  }

  return c.json(result);
};
