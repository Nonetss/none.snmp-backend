import { db } from '@/core/config';
import { snmpAuthTable, deviceTable, subnetTable } from '@/db';
import { eq } from 'drizzle-orm';
import { pingHost } from '@/lib/icmp';
import { getSNMP } from '@/lib/snmp';
import { pollAll } from '@/lib/snmp/poll/all';
import { getAllIps } from '@/lib/ip';

export async function scanSubnet(subnetId: number) {
  const [subnet] = await db
    .select()
    .from(subnetTable)
    .where(eq(subnetTable.id, subnetId));

  if (!subnet) {
    throw new Error(`Subnet with ID ${subnetId} not found`);
  }

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

    if (successfulAuthId) {
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

        if (device) {
          try {
            await pollAll(device.id);
          } catch (pollError) {
            console.error(`[Scan] Error polling device ${ip}:`, pollError);
          }
        }

        return {
          ip,
          status: 'success',
          authId: successfulAuthId,
          deviceId: device?.id,
        };
      } catch (dbError) {
        console.error(`[Scan] DB error for IP ${ip}:`, dbError);
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

export async function scanAllSubnets() {
  const subnets = await db.select().from(subnetTable);
  console.log(`[Scan All] Starting scan for ${subnets.length} subnets...`);

  const allResults = [];
  for (const subnet of subnets) {
    try {
      const results = await scanSubnet(subnet.id);
      allResults.push({ subnetId: subnet.id, results });
    } catch (e) {
      console.error(`[Scan All] Error scanning subnet ${subnet.id}:`, e);
    }
  }
  return allResults;
}
