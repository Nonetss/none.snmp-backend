import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  routeTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, sanitizeString } from '@/lib/snmp';

const ROUTE_METRICS = [
  'ipCidrRouteDest',
  'ipCidrRouteMask',
  'ipCidrRouteNextHop',
  'ipCidrRouteIfIndex',
  'ipCidrRouteType',
  'ipCidrRouteProto',
  'ipCidrRouteAge',
  'ipCidrRouteMetric1',
] as const;

function bufferToIp(buf: Buffer): string {
  if (buf.length === 4) return `${buf[0]}.${buf[1]}.${buf[2]}.${buf[3]}`;
  return sanitizeString(buf);
}

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  if (Buffer.isBuffer(value)) {
    if (
      name.includes('Dest') ||
      name.includes('Mask') ||
      name.includes('NextHop')
    ) {
      return bufferToIp(value);
    }
    return sanitizeString(value);
  }

  if (
    [
      'ipCidrRouteIfIndex',
      'ipCidrRouteType',
      'ipCidrRouteProto',
      'ipCidrRouteAge',
      'ipCidrRouteMetric1',
    ].includes(name)
  ) {
    return parseInt(String(value), 10);
  }

  return sanitizeString(value);
}

export async function pollRoutes(deviceId?: number) {
  console.time('pollRoutes');

  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, Array.from(ROUTE_METRICS)));

  if (metrics.length === 0) {
    console.warn('[Route Poll] No metrics defined for IP-FORWARD-MIB.');
    return;
  }

  const query = db
    .select({
      id: deviceTable.id,
      ipv4: deviceTable.ipv4,
      snmpAuth: snmpAuthTable,
    })
    .from(deviceTable)
    .innerJoin(snmpAuthTable, eq(deviceTable.snmpAuthId, snmpAuthTable.id));

  if (deviceId) {
    query.where(eq(deviceTable.id, deviceId));
  }

  const devices = await query;
  console.log(`[Route Poll] Processing ${devices.length} devices...`);

  const CONCURRENCY_LIMIT = 5;

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
      const promises = metrics.map(async (metric) => {
        try {
          const result = await walkSNMP(
            device.ipv4,
            device.snmpAuth,
            metric.oidBase,
            3000,
          );
          return { name: metric.name, result, baseOid: metric.oidBase };
        } catch (error) {
          return { name: metric.name, result: [], baseOid: metric.oidBase };
        }
      });

      const data = await Promise.all(promises);
      const routesMap = new Map<string, any>();

      for (const { name, result, baseOid } of data) {
        const baseLen = baseOid.split('.').length;
        for (const varbind of result) {
          const parts = varbind.oid.split('.');
          const indexKey = parts.slice(baseLen).join('.'); // dest.mask.tos.hop

          if (!routesMap.has(indexKey)) {
            routesMap.set(indexKey, {});
          }

          routesMap.get(indexKey)[name] = formatValue(name, varbind.value);
        }
      }

      const routeEntries = Array.from(routesMap.values());

      if (routeEntries.length > 0) {
        await db
          .insert(routeTable)
          .values(
            routeEntries.map((r) => ({
              deviceId: device.id,
              dest: r.ipCidrRouteDest || '',
              mask: r.ipCidrRouteMask,
              nextHop: r.ipCidrRouteNextHop || '',
              ifIndex: r.ipCidrRouteIfIndex,
              type: r.ipCidrRouteType,
              proto: r.ipCidrRouteProto,
              age: r.ipCidrRouteAge,
              metric1: r.ipCidrRouteMetric1,
            })),
          )
          .onConflictDoUpdate({
            target: [routeTable.deviceId, routeTable.dest, routeTable.nextHop],
            set: {
              mask: sql`EXCLUDED.mask`,
              ifIndex: sql`EXCLUDED.if_index`,
              type: sql`EXCLUDED.type`,
              proto: sql`EXCLUDED.proto`,
              age: sql`EXCLUDED.age`,
              metric1: sql`EXCLUDED.metric1`,
              updatedAt: new Date(),
            },
          });
        console.log(
          `[Route Poll] ${device.ipv4}: Success (${routeEntries.length} routes)`,
        );
      } else {
        console.log(`[Route Poll] ${device.ipv4}: No routes found`);
      }
    } catch (error) {
      console.error(`[Route Poll] Error ${device.ipv4}:`, error);
    }
  };

  for (let i = 0; i < devices.length; i += CONCURRENCY_LIMIT) {
    const batch = devices.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(batch.map(processDevice));
  }

  console.timeEnd('pollRoutes');
}
