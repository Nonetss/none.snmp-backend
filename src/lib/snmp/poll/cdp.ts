import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  interfaceTable,
  snmpAuthTable,
  cdpNeighborTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, sanitizeString } from '@/lib/snmp';

const CDP_METRICS = [
  'cdpCacheAddress',
  'cdpCacheDeviceId',
  'cdpCacheDevicePort',
  'cdpCachePlatform',
  'cdpCacheSysName',
] as const;

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  if (Buffer.isBuffer(value)) {
    // 1. Dirección IPv4
    if (name === 'cdpCacheAddress' && value.length === 4) {
      return `${value[0]}.${value[1]}.${value[2]}.${value[3]}`;
    }

    // 2. Detección de MAC o datos binarios (6 bytes no imprimibles)
    if (value.length === 6) {
      const isPrintable = value.every((b) => b >= 32 && b <= 126);
      if (!isPrintable) {
        return Array.from(value)
          .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
          .join(':');
      }
    }
  }

  // 3. Limpieza de strings (Agresivo ASCII para CDP para evitar basura binaria)
  // Se elimina cualquier carácter fuera del rango ASCII imprimible (incluyendo replacement chars )
  return sanitizeString(value)
    .replace(/[^\x20-\x7E]/g, '')
    .trim();
}

export async function pollCdp(deviceId?: number) {
  console.time('pollCdp');

  // 1. Obtener definiciones de métricas
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, Array.from(CDP_METRICS)));

  if (metrics.length === 0) {
    console.warn('[CDP Poll] No metrics defined for CISCO-CDP-MIB.');
    return;
  }

  // 2. Cache para resolución de topología
  const allDevices = await db.select().from(deviceTable);
  const deviceIpMap = new Map(allDevices.map((d) => [d.ipv4, d.id]));

  // 3. Obtener dispositivo(s)
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
  console.log(`[CDP Poll] Processing ${devices.length} devices...`);

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
      // Interfaces locales para mapear interfaceId
      const deviceInterfaces = await db
        .select()
        .from(interfaceTable)
        .where(eq(interfaceTable.deviceId, device.id));
      const ifIndexMap = new Map(
        deviceInterfaces.map((i) => [i.ifIndex, i.id]),
      );

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

      // Index key: ifIndex.deviceIndex
      const neighborsMap = new Map<string, any>();

      for (const { name, result, baseOid } of data) {
        const baseLen = baseOid.split('.').length;
        for (const varbind of result) {
          const parts = varbind.oid.split('.');
          const indexKey = parts.slice(baseLen).join('.'); // ifIndex.deviceIndex

          if (!neighborsMap.has(indexKey)) {
            const indexParts = indexKey.split('.');
            neighborsMap.set(indexKey, {
              ifIndex: parseInt(indexParts[0], 10),
              neighborIndex: parseInt(indexParts[1], 10),
            });
          }

          neighborsMap.get(indexKey)[name] = formatValue(name, varbind.value);
        }
      }

      const neighborEntries = Array.from(neighborsMap.values());

      if (neighborEntries.length > 0) {
        await db
          .insert(cdpNeighborTable)
          .values(
            neighborEntries.map((n) => {
              // Intentar resolver remoteDeviceId por IP
              let remoteDeviceId: number | null = null;
              if (n.cdpCacheAddress && deviceIpMap.has(n.cdpCacheAddress)) {
                remoteDeviceId = deviceIpMap.get(n.cdpCacheAddress)!;
              }

              return {
                deviceId: device.id,
                interfaceId: ifIndexMap.get(n.ifIndex) || null,
                ifIndex: n.ifIndex,
                neighborIndex: n.neighborIndex,
                address: n.cdpCacheAddress,
                neighborDeviceId: n.cdpCacheDeviceId,
                neighborPort: n.cdpCacheDevicePort,
                neighborPlatform: n.cdpCachePlatform,
                neighborSysName: n.cdpCacheSysName,
                remoteDeviceId,
              };
            }),
          )
          .onConflictDoUpdate({
            target: [
              cdpNeighborTable.deviceId,
              cdpNeighborTable.ifIndex,
              cdpNeighborTable.neighborIndex,
            ],
            set: {
              interfaceId: sql`EXCLUDED.interface_id`,
              address: sql`EXCLUDED.address`,
              neighborDeviceId: sql`EXCLUDED.neighbor_device_id`,
              neighborPort: sql`EXCLUDED.neighbor_port`,
              neighborPlatform: sql`EXCLUDED.neighbor_platform`,
              neighborSysName: sql`EXCLUDED.neighbor_sys_name`,
              remoteDeviceId: sql`EXCLUDED.remote_device_id`,
              updatedAt: new Date(),
            },
          });
        console.log(
          `[CDP Poll] ${device.ipv4}: Success (${neighborEntries.length} neighbors)`,
        );
      } else {
        console.log(`[CDP Poll] ${device.ipv4}: No CDP neighbors found`);
      }
    } catch (error) {
      console.error(`[CDP Poll] Error ${device.ipv4}:`, error);
    }
  };

  await Promise.all(devices.map(processDevice));

  console.timeEnd('pollCdp');
}
