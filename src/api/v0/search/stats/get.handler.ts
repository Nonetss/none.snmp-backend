import { db } from '@/core/config';
import {
  deviceTable,
  lldpNeighborTable,
  cdpNeighborTable,
  subnetTable,
  snmpAuthTable,
  interfaceTable,
  interfaceDataTable,
  routeTable,
  ipNetToMediaTable,
  bridgeFdbTable,
  ipAddrEntryTable,
  deviceStatusTable,
} from '@/db';
import { sql, count, eq, isNotNull, gt, desc, ne, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getStatsRoute } from './get.route';

export const getStatsHandler: RouteHandler<typeof getStatsRoute> = async (
  c,
) => {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      [managedCount],
      externalResult,
      subDist,
      snmpDist,
      [lldpCount],
      [cdpCount],
      [fdbCount],
      [routesCount],
      [resolvedLldp],
      [resolvedCdp],
      [totalIps],
      [arpCount],
      ifaceStats,
      topHubsData,
      [newNeighbors],
      [newArp],
      statusStats,
    ] = await Promise.all([
      db.select({ value: count() }).from(deviceTable),
      db.execute(sql`
        SELECT count(DISTINCT id)::int as value FROM (
          SELECT COALESCE(lldp_rem_chassis_id, lldp_rem_sys_name) as id FROM lldp_neighbor WHERE remote_device_id IS NULL
          UNION
          SELECT cdp_cache_device_id as id FROM cdp_neighbor WHERE remote_device_id IS NULL
        ) as unique_ext
      `),
      db
        .select({
          subnetName: subnetTable.name,
          cidr: subnetTable.cidr,
          deviceCount: count(deviceTable.id),
          upCount: sql<number>`count(${deviceStatusTable.status}) FILTER (WHERE ${deviceStatusTable.status} = true)::int`,
          downCount: sql<number>`count(${deviceStatusTable.status}) FILTER (WHERE ${deviceStatusTable.status} = false)::int`,
        })
        .from(subnetTable)
        .leftJoin(deviceTable, eq(subnetTable.id, deviceTable.subnetId))
        .leftJoin(
          deviceStatusTable,
          eq(deviceTable.id, deviceStatusTable.deviceId),
        )
        .groupBy(subnetTable.id, subnetTable.name, subnetTable.cidr),
      db
        .select({
          version: snmpAuthTable.version,
          deviceCount: count(deviceTable.id),
        })
        .from(snmpAuthTable)
        .innerJoin(deviceTable, eq(snmpAuthTable.id, deviceTable.snmpAuthId))
        .groupBy(snmpAuthTable.version),
      db.select({ value: count() }).from(lldpNeighborTable),
      db.select({ value: count() }).from(cdpNeighborTable),
      db.select({ value: count() }).from(bridgeFdbTable),
      db
        .select({ value: count() })
        .from(routeTable)
        .where(
          and(
            ne(routeTable.nextHop, '0.0.0.0'),
            ne(routeTable.nextHop, '127.0.0.1'),
          ),
        ),
      db
        .select({ value: count() })
        .from(lldpNeighborTable)
        .where(isNotNull(lldpNeighborTable.remoteDeviceId)),
      db
        .select({ value: count() })
        .from(cdpNeighborTable)
        .where(isNotNull(cdpNeighborTable.remoteDeviceId)),
      db.select({ value: count() }).from(ipAddrEntryTable),
      db.select({ value: count() }).from(ipNetToMediaTable),
      db
        .select({ status: interfaceDataTable.ifOperStatus, count: count() })
        .from(interfaceDataTable)
        .groupBy(interfaceDataTable.ifOperStatus),
      db
        .select({
          name: deviceTable.name,
          connections: count(lldpNeighborTable.id),
        })
        .from(deviceTable)
        .innerJoin(
          lldpNeighborTable,
          eq(deviceTable.id, lldpNeighborTable.deviceId),
        )
        .groupBy(deviceTable.id, deviceTable.name)
        .orderBy(desc(sql`count(*)`))
        .limit(5),
      db
        .select({ value: count() })
        .from(lldpNeighborTable)
        .where(gt(lldpNeighborTable.updatedAt, yesterday)),
      db
        .select({ value: count() })
        .from(ipNetToMediaTable)
        .where(gt(ipNetToMediaTable.time, yesterday)),
      db
        .select({ status: deviceStatusTable.status, count: count() })
        .from(deviceStatusTable)
        .groupBy(deviceStatusTable.status),
    ]);

    const ifUp = ifaceStats.find((s) => (s as any).status === 1)?.count || 0;
    const ifDown = ifaceStats.find((s) => (s as any).status === 2)?.count || 0;
    const ifOther = ifaceStats.reduce(
      (acc, s) =>
        (s as any).status !== 1 && (s as any).status !== 2
          ? acc + s.count
          : acc,
      0,
    );

    const devicesUp = statusStats.find((s) => s.status === true)?.count || 0;
    const devicesDown = statusStats.find((s) => s.status === false)?.count || 0;

    return c.json(
      {
        devices: {
          totalManaged: managedCount.value,
          totalExternal: (externalResult.rows[0] as any).value || 0,
          up: devicesUp,
          down: devicesDown,
        },
        topology: {
          lldpConnections: lldpCount.value,
          cdpConnections: cdpCount.value,
          fdbConnections: fdbCount.value,
          routingEdges: routesCount.value,
          resolvedLinks: (resolvedLldp.value || 0) + (resolvedCdp.value || 0),
        },
        network: {
          subnets: subDist.length,
          totalIps: totalIps.value,
          activeArpEntries: arpCount.value,
        },
        subnetsDistribution: subDist as any,
        snmpVersionDistribution: snmpDist as any,
        interfaceStatus: {
          up: ifUp,
          down: ifDown,
          other: ifOther,
        },
        topHubs: topHubsData as any,
        activity: {
          updatedNeighbors24h: newNeighbors.value,
          arpDiscoveries24h: newArp.value,
        },
      },
      200,
    );
  } catch (error) {
    console.error('[Get Stats] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
