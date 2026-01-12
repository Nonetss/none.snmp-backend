import { Handler } from 'hono';
import { db } from '@/core/config';
import { computerSystemTable, networkIdentityTable } from '@/db';
import { gte, lte, and, desc, eq } from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getComputerRamHandler: Handler = async (c) => {
  const { minRam, maxRam, excel } = c.req.valid('query' as any);

  const filters = [];
  const GB_TO_BYTES = 1024 * 1024 * 1024;

  if (minRam) {
    filters.push(
      gte(
        computerSystemTable.TotalPhysicalMemory,
        Number(minRam) * GB_TO_BYTES,
      ),
    );
  }

  if (maxRam) {
    filters.push(
      lte(
        computerSystemTable.TotalPhysicalMemory,
        Number(maxRam) * GB_TO_BYTES,
      ),
    );
  }

  const computers = await db
    .select()
    .from(computerSystemTable)
    .where(filters.length > 0 ? and(...filters) : undefined);

  const allIdentities = await db
    .select()
    .from(networkIdentityTable)
    .orderBy(desc(networkIdentityTable.id));

  const latestIps: Record<number, string> = {};
  for (const identity of allIdentities) {
    const iden = (identity as any).network_identity || identity;
    if (iden.ComputerSystemId && !latestIps[iden.ComputerSystemId]) {
      latestIps[iden.ComputerSystemId] = iden.IPAddress || '';
    }
  }

  const result = computers.map((comp) => ({
    ...comp,
    ip: latestIps[comp.id] || null,
  }));

  if (excel === 'true') {
    return sendExcel(c, result, 'computer_ram');
  }

  return c.json(result);
};
