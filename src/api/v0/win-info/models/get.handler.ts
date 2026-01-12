import { Handler } from 'hono';
import { db } from '@/core/config';
import { computerSystemTable, networkIdentityTable } from '@/db';
import { desc, eq } from 'drizzle-orm';
import { sendExcel } from '@/lib/excel';

export const getComputerModelsHandler: Handler = async (c) => {
  const { excel } = c.req.query();
  const computers = await db.select().from(computerSystemTable);

  // Fetch all identities ordered by ID desc to get the most recent ones first
  const allIdentities = await db
    .select()
    .from(networkIdentityTable)
    .orderBy(desc(networkIdentityTable.id));

  // Map to store only the first (latest) IP found for each computer
  const latestIps: Record<number, string> = {};
  for (const identity of allIdentities) {
    const iden = (identity as any).network_identity || identity;
    if (iden.ComputerSystemId && !latestIps[iden.ComputerSystemId]) {
      latestIps[iden.ComputerSystemId] = iden.IPAddress || '';
    }
  }

  const grouped = computers.reduce((acc: Record<string, any[]>, comp) => {
    const model = comp.Model || 'Unknown';
    if (!acc[model]) {
      acc[model] = [];
    }
    acc[model].push({
      id: comp.id,
      name: comp.Name,
      ip: latestIps[comp.id] || null,
    });
    return acc;
  }, {});

  const result = Object.entries(grouped).map(([model, computers]) => ({
    model: model === 'Unknown' ? null : model,
    computers,
  }));

  if (excel === 'true') {
    // Flatten result for Excel: model, computerId, computerName, ip
    const flatResult = result.flatMap((group) =>
      group.computers.map((comp) => ({
        model: group.model,
        computerId: comp.id,
        computerName: comp.name,
        ip: comp.ip,
      })),
    );
    return sendExcel(c, flatResult, 'computer_models');
  }

  return c.json(result);
};
