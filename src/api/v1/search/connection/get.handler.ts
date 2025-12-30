import { db } from '@/core/config';
import {
  bridgeFdbTable,
  bridgePortTable,
  deviceTable,
  interfaceTable,
  ipNetToMediaTable,
  systemTable,
} from '@/db';
import { eq, and, inArray, sql } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getConnectionSearchRoute } from './get.route';

// --- HELPERS DE TRADUCCIÓN ---

const IF_TYPES: Record<string, string> = {
  '1': 'other',
  '6': 'ethernetCsmacd',
  '24': 'softwareLoopback',
  '32': 'frameRelay',
  '53': 'propVirtual', // VLANs usualmente
  '117': 'gigabitEthernet',
  '131': 'tunnel',
  '135': 'l2vlan',
  '161': 'ieee8023adLag', // Port Channels / EtherChannels
};

const formatSpeed = (speed: number | null): string | null => {
  if (speed === null || speed === undefined) return null;
  if (speed === 0) return '0 bps';
  if (speed >= 1000000000) return `${speed / 1000000000} Gbps`;
  if (speed >= 1000000) return `${speed / 1000000} Mbps`;
  if (speed >= 1000) return `${speed / 1000} Kbps`;
  return `${speed} bps`;
};

// --- HANDLER PRINCIPAL ---

export const getConnectionSearchHandler: RouteHandler<
  typeof getConnectionSearchRoute
> = async (c) => {
  const { query } = c.req.valid('query');

  try {
    let targetMacs: string[] = [query.toUpperCase()];
    const ipMap = new Map<string, string>();

    // 0. Lógica de búsqueda por IP si aplica
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(query)) {
      const arpEntries = await db
        .select()
        .from(ipNetToMediaTable)
        .where(eq(ipNetToMediaTable.ipNetToMediaNetAddress, query));

      if (arpEntries.length > 0) {
        targetMacs = arpEntries.map((e) => e.ipNetToMediaPhysAddress);
        arpEntries.forEach((e) => ipMap.set(e.ipNetToMediaPhysAddress, query));
      } else {
        return c.json([], 200);
      }
    }

    // 1. Encontrar en qué switches/puertos está la MAC
    const fdbEntries = await db
      .select({
        switchId: deviceTable.id,
        switchName: systemTable.sysName,
        switchIp: deviceTable.ipv4,
        switchLocation: systemTable.sysLocation,
        bridgePort: bridgeFdbTable.port,
        ifName: interfaceTable.ifName,
        ifDescr: interfaceTable.ifDescr,
        ifSpeed: interfaceTable.ifSpeed,
        ifType: interfaceTable.ifType,
        macAddress: bridgeFdbTable.address,
        lastSeen: bridgeFdbTable.updatedAt,
      })
      .from(bridgeFdbTable)
      .innerJoin(deviceTable, eq(bridgeFdbTable.deviceId, deviceTable.id))
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
      .leftJoin(
        bridgePortTable,
        and(
          eq(bridgePortTable.deviceId, bridgeFdbTable.deviceId),
          eq(bridgePortTable.bridgePort, bridgeFdbTable.port),
        ),
      )
      .leftJoin(
        interfaceTable,
        and(
          eq(interfaceTable.deviceId, bridgeFdbTable.deviceId),
          eq(interfaceTable.ifIndex, bridgePortTable.ifIndex),
        ),
      )
      .where(inArray(bridgeFdbTable.address, targetMacs));

    if (fdbEntries.length === 0) return c.json([], 200);

    // 2. Para cada puerto encontrado, contar cuántas MACs totales tiene
    const resultsWithCount = await Promise.all(
      fdbEntries.map(async (entry) => {
        const [{ count }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(bridgeFdbTable)
          .where(
            and(
              eq(bridgeFdbTable.deviceId, entry.switchId),
              eq(bridgeFdbTable.port, entry.bridgePort),
            ),
          );

        return {
          ...entry,
          portMacCount: Number(count),
        };
      }),
    );

    // 3. Identificar el "Most Likely" y transformar tipos a String
    const minMacs = Math.min(...resultsWithCount.map((r) => r.portMacCount));

    const finalResults = resultsWithCount
      .map((r) => ({
        switchId: r.switchId,
        switchName: r.switchName,
        switchIp: r.switchIp,
        switchLocation: r.switchLocation,
        bridgePort: r.bridgePort,
        portMacCount: r.portMacCount,
        isMostLikely: r.portMacCount === minMacs,
        interface:
          r.ifName || r.ifDescr
            ? {
                ifName: r.ifName,
                ifDescr: r.ifDescr,
                // Transformación de Integer a String legible
                ifSpeed: formatSpeed(r.ifSpeed ? Number(r.ifSpeed) : null),
                // Transformación de Integer a Nombre de Tipo
                ifType: r.ifType
                  ? IF_TYPES[String(r.ifType)] || `unknown(${r.ifType})`
                  : 'unknown',
              }
            : null,
        macAddress: r.macAddress,
        ipAddress: ipMap.get(r.macAddress) || null,
        lastSeen: r.lastSeen
          ? r.lastSeen.toISOString()
          : new Date().toISOString(),
      }))
      .sort((a, b) => a.portMacCount - b.portMacCount);

    return c.json(finalResults, 200);
  } catch (error) {
    console.error(`[Connection Search] Error:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
