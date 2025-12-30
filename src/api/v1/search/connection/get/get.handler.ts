import {
  bridgeFdbTable,
  bridgePortTable,
  deviceTable,
  interfaceTable,
  ipNetToMediaTable,
  systemTable,
  lldpNeighborTable,
  cdpNeighborTable,
} from '@/db';
import { eq, and, inArray, sql, or } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getConnectionSearchRoute } from './get.route';
import { db } from '@/core/config';

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
    // --- A. Búsqueda en LLDP (Máxima confianza) ---
    const lldpMatches = await db
      .select({
        switchId: deviceTable.id,
        switchName: systemTable.sysName,
        switchIp: deviceTable.ipv4,
        switchLocation: systemTable.sysLocation,
        ifIndex: lldpNeighborTable.localPortNum,
        macAddress: lldpNeighborTable.chassisId,
        lastSeen: lldpNeighborTable.updatedAt,
      })
      .from(lldpNeighborTable)
      .innerJoin(deviceTable, eq(lldpNeighborTable.deviceId, deviceTable.id))
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
      .where(inArray(lldpNeighborTable.chassisId, targetMacs));

    // --- B. Búsqueda en CDP ---
    const cdpMatches = await db
      .select({
        switchId: deviceTable.id,
        switchName: systemTable.sysName,
        switchIp: deviceTable.ipv4,
        switchLocation: systemTable.sysLocation,
        ifIndex: cdpNeighborTable.ifIndex,
        macAddress: cdpNeighborTable.neighborDeviceId,
        lastSeen: cdpNeighborTable.updatedAt,
      })
      .from(cdpNeighborTable)
      .innerJoin(deviceTable, eq(cdpNeighborTable.deviceId, deviceTable.id))
      .leftJoin(systemTable, eq(deviceTable.id, systemTable.deviceId))
      .where(inArray(cdpNeighborTable.neighborDeviceId, targetMacs));

    // --- C. Búsqueda en FDB (Tradicional) ---
    const fdbEntries = await db
      .select({
        switchId: deviceTable.id,
        switchName: systemTable.sysName,
        switchIp: deviceTable.ipv4,
        switchLocation: systemTable.sysLocation,
        bridgePort: bridgeFdbTable.port,
        ifIndex: bridgePortTable.ifIndex,
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
      .where(inArray(bridgeFdbTable.address, targetMacs));

    // 2. Consolidar resultados (LLDP/CDP tienen prioridad de confianza)
    const allMatches = [
      ...lldpMatches.map((m) => ({
        ...m,
        bridgePort: null,
        confidence: 'high',
        resolvedBy: 'LLDP' as const,
      })),
      ...cdpMatches.map((m) => ({
        ...m,
        bridgePort: null,
        confidence: 'high',
        resolvedBy: 'CDP' as const,
      })),
      ...fdbEntries.map((m) => ({
        ...m,
        confidence: 'low',
        resolvedBy: 'FDB' as const,
      })),
    ];

    if (allMatches.length === 0) return c.json([], 200);

    // 3. Enriquecer con información de interfaces y conteo de MACs
    const resultsWithCount = await Promise.all(
      allMatches.map(async (entry) => {
        let portMacCount = 1;

        // Si es FDB, contamos cuántas MACs hay en ese puerto para ver si es Uplink
        if (entry.confidence === 'low' && entry.bridgePort !== null) {
          const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(bridgeFdbTable)
            .where(
              and(
                eq(bridgeFdbTable.deviceId, entry.switchId),
                eq(bridgeFdbTable.port, entry.bridgePort),
              ),
            );
          portMacCount = Number(count);
        }

        // Obtener detalles de la interfaz
        const [iface] = await db
          .select()
          .from(interfaceTable)
          .where(
            and(
              eq(interfaceTable.deviceId, entry.switchId),
              eq(interfaceTable.ifIndex, entry.ifIndex!),
            ),
          );

        return {
          ...entry,
          portMacCount,
          ifName: iface?.ifName,
          ifDescr: iface?.ifDescr,
          ifSpeed: iface?.ifSpeed,
          ifType: iface?.ifType,
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
        resolvedBy: r.resolvedBy,
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
        ipAddress: ipMap.get(r.macAddress!) || null,
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
