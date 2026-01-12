import { Handler } from 'hono';
import { db } from '@/core/config';
import { computerSystemTable, networkIdentityTable } from '@/db';
import { desc, eq } from 'drizzle-orm';

export const getComputersHandler: Handler = async (c) => {
  const computers = await db.select().from(computerSystemTable);

  const allIdentities = await db
    .select()
    .from(networkIdentityTable)
    .orderBy(desc(networkIdentityTable.id));

  const latestIps: Record<number, string> = {};
  for (const identity of allIdentities) {
    if (identity.ComputerSystemId && !latestIps[identity.ComputerSystemId]) {
      latestIps[identity.ComputerSystemId] = identity.IPAddress || '';
    }
  }

  const result = computers.map((comp) => ({
    ...comp,
    ip: latestIps[comp.id] || null,
  }));

  return c.json(result);
};
