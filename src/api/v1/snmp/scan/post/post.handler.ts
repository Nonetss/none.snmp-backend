import { db } from '@/core/config';
import { snmpAuthTable, deviceTable, subnetTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postScanRoute } from './post.route';
import { pingHost } from '@/lib/icmp';
import { getSNMP } from '@/lib/snmp';
import { pollAll } from '@/lib/snmp/poll/all';
import { getAllIps } from '@/lib/ip';

export const postScanHandler: RouteHandler<typeof postScanRoute> = async (
  c,
) => {
  const { cidr, subnetName } = c.req.valid('json');

  try {
    let [subnet] = await db
      .select()
      .from(subnetTable)
      .where(eq(subnetTable.cidr, cidr));
    if (!subnet) {
      [subnet] = await db
        .insert(subnetTable)
        .values({
          cidr,
          name: subnetName || `Subnet ${cidr}`,
        })
        .returning();
    }

    const allAuths = await db.select().from(snmpAuthTable);
    const ips = getAllIps(cidr);

    // Concurrencia limitada
    const CONCURRENCY_LIMIT = 50;
    const results: any[] = [];

    const scanIp = async (ip: string) => {
      const pingRes = await pingHost(ip, 1);
      if (!pingRes.alive) {
        return { ip, status: 'offline' };
      }

      let successfulAuthId: number | undefined;

      for (const auth of allAuths) {
        try {
          // Usar GET en lugar de WALK para verificar credenciales es más rápido y compatible
          const varbinds = await getSNMP(ip, auth, ['1.3.6.1.2.1.1.1.0'], 1000);
          if (varbinds.length > 0) {
            successfulAuthId = auth.id;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (successfulAuthId) {
        const [device] = await db
          .insert(deviceTable)
          .values({
            ipv4: ip,
            subnetId: subnet.id,
            snmpAuthId: successfulAuthId,
          })
          .onConflictDoUpdate({
            target: [deviceTable.ipv4],
            set: {
              snmpAuthId: successfulAuthId,
              subnetId: subnet.id,
            },
          })
          .returning({ id: deviceTable.id });

        if (device) {
          // Trigger full poll for the discovered device
          await pollAll(device.id);
        }

        return {
          ip,
          status: 'success',
          authId: successfulAuthId,
          deviceId: device?.id,
        };
      }

      return { ip, status: 'failed' };
    };

    // Procesar en lotes para no saturar
    for (let i = 0; i < ips.length; i += CONCURRENCY_LIMIT) {
      const batch = ips.slice(i, i + CONCURRENCY_LIMIT);
      const batchResults = await Promise.all(batch.map((ip) => scanIp(ip)));
      results.push(...batchResults);
    }

    return c.json({ message: 'Scan completed', results }, 200);
  } catch (error) {
    console.error('Error in scan:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
