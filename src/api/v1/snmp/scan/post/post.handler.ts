import { db } from '@/core/config';
import { snmpAuthTable, deviceTable, subnetTable } from '@/db';
import { eq, sql } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postScanRoute } from './post.route';
import { pingHost } from '@/lib/icmp';
import { walkSNMP, getSNMP } from '@/lib/snmp';
import * as ipaddr from 'ipaddr.js';

function getAllIps(cidr: string): string[] {
  try {
    const network = ipaddr.parseCIDR(cidr);
    const start = network[0].toByteArray();
    const mask = network[1];

    const ips: string[] = [];
    const numIps = Math.pow(2, 32 - mask);

    let startInt =
      (start[0] << 24) | (start[1] << 16) | (start[2] << 8) | start[3];

    for (let i = 1; i < numIps - 1; i++) {
      const currentInt = startInt + i;
      const ip = [
        (currentInt >>> 24) & 0xff,
        (currentInt >>> 16) & 0xff,
        (currentInt >>> 8) & 0xff,
        currentInt & 0xff,
      ].join('.');
      ips.push(ip);
    }
    return ips;
  } catch (e) {
    return [];
  }
}

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
        await db.execute(sql`
          INSERT INTO ${deviceTable} (ipv4, subnet_id, snmp_auth_id)
          VALUES (${ip}, ${subnet.id}, ${successfulAuthId})
          ON CONFLICT (ipv4) DO UPDATE
          SET snmp_auth_id = ${successfulAuthId}, subnet_id = ${subnet.id}
        `);
        return { ip, status: 'success', authId: successfulAuthId };
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
