import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  lldpNeighborTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, sanitizeString } from '@/lib/snmp';

const LLDP_METRICS = [
  'lldpRemChassisIdSubtype',
  'lldpRemChassisId',
  'lldpRemPortIdSubtype',
  'lldpRemPortId',
  'lldpRemPortDesc',
  'lldpRemSysName',
  'lldpRemSysDesc',
  'lldpRemSysCapSupported',
  'lldpRemSysCapEnabled',
] as const;

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  if (Buffer.isBuffer(value)) {
    // Detección de MAC o datos binarios
    if (value.length === 6) {
      const isPrintable = value.every((b) => b >= 32 && b <= 126);
      if (!isPrintable) {
        return Array.from(value)
          .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
          .join(':');
      }
    }

    if (name === 'lldpRemSysCapSupported' || name === 'lldpRemSysCapEnabled') {
      // Los bits en SNMP suelen venir como buffer. Los pasamos a hex para legibilidad
      return value.toString('hex').toUpperCase();
    }
  }

  if (name === 'lldpRemChassisIdSubtype' || name === 'lldpRemPortIdSubtype') {
    return parseInt(String(value), 10);
  }

  // Limpieza agresiva para strings de vecinos
  return sanitizeString(value)
    .replace(/[^\x20-\x7E]/g, '')
    .trim();
}

export async function pollLldp(deviceId?: number) {
  console.time('pollLldp');

  // 1. Obtener definiciones de métricas
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, Array.from(LLDP_METRICS)));

  if (metrics.length === 0) {
    console.warn('[LLDP Poll] No metrics defined for LLDP-MIB.');
    return;
  }

  // 2. Obtener dispositivo(s)
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
  console.log(`[LLDP Poll] Processing ${devices.length} devices...`);

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

      // Index key: lldpRemTimeMark.lldpRemLocalPortNum.lldpRemIndex
      const neighborsMap = new Map<string, any>();

      for (const { name, result, baseOid } of data) {
        const baseLen = baseOid.split('.').length;
        for (const varbind of result) {
          const parts = varbind.oid.split('.');
          const indexParts = parts.slice(baseLen);

          if (indexParts.length < 3) continue;

          // Ignoramos TimeMark (indexParts[0]) para la llave única del vecino actual
          const indexKey = indexParts.slice(1).join('.'); // localPortNum.neighborIndex

          if (!neighborsMap.has(indexKey)) {
            neighborsMap.set(indexKey, {
              localPortNum: parseInt(indexParts[1], 10),
              neighborIndex: parseInt(indexParts[2], 10),
            });
          }

          neighborsMap.get(indexKey)[name] = formatValue(name, varbind.value);
        }
      }

      const neighborEntries = Array.from(neighborsMap.values());

      if (neighborEntries.length > 0) {
        await db
          .insert(lldpNeighborTable)
          .values(
            neighborEntries.map((n) => ({
              deviceId: device.id,
              localPortNum: n.localPortNum,
              neighborIndex: n.neighborIndex,
              chassisIdSubtype: n.lldpRemChassisIdSubtype,
              chassisId: n.lldpRemChassisId,
              portIdSubtype: n.lldpRemPortIdSubtype,
              portId: n.lldpRemPortId,
              portDesc: n.lldpRemPortDesc,
              sysName: n.lldpRemSysName,
              sysDesc: n.lldpRemSysDesc,
              sysCapSupported: n.lldpRemSysCapSupported,
              sysCapEnabled: n.lldpRemSysCapEnabled,
            })),
          )
          .onConflictDoUpdate({
            target: [
              lldpNeighborTable.deviceId,
              lldpNeighborTable.localPortNum,
              lldpNeighborTable.neighborIndex,
            ],
            set: {
              chassisIdSubtype: sql`EXCLUDED.chassis_id_subtype`,
              chassisId: sql`EXCLUDED.chassis_id`,
              portIdSubtype: sql`EXCLUDED.port_id_subtype`,
              portId: sql`EXCLUDED.port_id`,
              portDesc: sql`EXCLUDED.port_desc`,
              sysName: sql`EXCLUDED.sys_name`,
              sysDesc: sql`EXCLUDED.sys_desc`,
              sysCapSupported: sql`EXCLUDED.sys_cap_supported`,
              sysCapEnabled: sql`EXCLUDED.sys_cap_enabled`,
              updatedAt: new Date(),
            },
          });
        console.log(
          `[LLDP Poll] ${device.ipv4}: Success (${neighborEntries.length} neighbors)`,
        );
      } else {
        console.log(`[LLDP Poll] ${device.ipv4}: No LLDP neighbors found`);
      }
    } catch (error) {
      console.error(`[LLDP Poll] Error ${device.ipv4}:`, error);
    }
  };

  // Procesar todos los dispositivos en paralelo
  await Promise.all(devices.map(processDevice));

  console.timeEnd('pollLldp');
}
