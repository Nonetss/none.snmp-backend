import { db } from '@/core/config';
import { snmpAuthTable, deviceTable, subnetTable } from '@/db';
import { eq } from 'drizzle-orm';
import { pingHost } from '@/lib/icmp';
import { getSNMP } from '@/lib/snmp';
import { pollAll } from '@/lib/snmp/poll/all';
import { getAllIps } from '@/lib/ip';
import { logger } from '@/lib/logger';

export async function scanSubnet(
  subnetId: number,
  overrideCreateIfPingable?: boolean,
) {
  const [subnet] = await db
    .select()
    .from(subnetTable)
    .where(eq(subnetTable.id, subnetId));

  if (!subnet) {
    throw new Error(`Subnet with ID ${subnetId} not found`);
  }

  const effectiveCreateIfPingable =
    overrideCreateIfPingable ?? subnet.scanPingable ?? false;

  const allAuths = await db.select().from(snmpAuthTable);
  const ips = getAllIps(subnet.cidr);

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

    // Skip .1 only if it's JUST pingable (no SNMP)
    if (ip.endsWith('.1') && !successfulAuthId) {
      return { ip, status: 'offline' };
    }

    if (successfulAuthId || effectiveCreateIfPingable) {
      try {
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

        if (device && successfulAuthId) {
          try {
            await pollAll(device.id);
          } catch (pollError) {
            logger.error({ pollError }, `[Scan] Error polling device ${ip}`);
          }
        }

        return {
          ip,
          status: successfulAuthId ? 'success' : 'pingable',
          authId: successfulAuthId,
          deviceId: device?.id,
        };
      } catch (dbError) {
        logger.error({ dbError }, `[Scan] DB error for IP ${ip}`);
        return { ip, status: 'failed' };
      }
    }

    return { ip, status: 'failed' };
  };

  for (let i = 0; i < ips.length; i += CONCURRENCY_LIMIT) {
    const batch = ips.slice(i, i + CONCURRENCY_LIMIT);
    const batchResults = await Promise.all(batch.map((ip) => scanIp(ip)));
    results.push(...batchResults);
  }

  return results;
}

export async function scanAllSubnets(overrideCreateIfPingable?: boolean) {
  const subnets = await db.select().from(subnetTable);
  logger.info(`[Scan All] Starting scan for ${subnets.length} subnets...`);

  const allResults = [];
  for (const subnet of subnets) {
    try {
      const results = await scanSubnet(subnet.id, overrideCreateIfPingable);
      allResults.push({ subnetId: subnet.id, results });
    } catch (e) {
      logger.error({ e }, `[Scan All] Error scanning subnet ${subnet.id}`);
    }
  }
  return allResults;
}
