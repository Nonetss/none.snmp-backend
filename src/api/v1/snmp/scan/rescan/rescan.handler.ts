import { db } from '@/core/config';
import { snmpAuthTable, deviceTable, subnetTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postRescanRoute } from './rescan.route';
import { pingHost } from '@/lib/icmp';
import { getSNMP } from '@/lib/snmp';
import { pollAll } from '@/lib/snmp/poll/all';
import { getAllIps } from '@/lib/ip';

export const postRescanHandler: RouteHandler<typeof postRescanRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param');

  try {
    const [subnet] = await db
      .select()
      .from(subnetTable)
      .where(eq(subnetTable.id, id));

    if (!subnet) {
      return c.json({ message: 'Subnet not found' }, 404) as any;
    }

    const allAuths = await db.select().from(snmpAuthTable);
    const ips = getAllIps(subnet.cidr);

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

    for (let i = 0; i < ips.length; i += CONCURRENCY_LIMIT) {
      const batch = ips.slice(i, i + CONCURRENCY_LIMIT);
      const batchResults = await Promise.all(batch.map((ip) => scanIp(ip)));
      results.push(...batchResults);
    }

    return c.json({ message: 'Scan completed', results }, 200);
  } catch (error) {
    console.error('Error in rescan:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
