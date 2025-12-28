import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  ipSnmpTable,
  ipAddrEntryTable,
  ipNetToMediaTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP } from '@/lib/snmp';

const TARGET_COLUMNS = [
  // ipAddrTable (1.3.6.1.2.1.4.20.1)
  'ipAdEntAddr',
  'ipAdEntIfIndex',
  'ipAdEntNetMask',
  'ipAdEntBcastAddr',
  'ipAdEntReasmMaxSize',
  // ipNetToMediaTable (1.3.6.1.2.1.4.22.1)
  'ipNetToMediaIfIndex',
  'ipNetToMediaPhysAddress',
  'ipNetToMediaNetAddress',
  'ipNetToMediaType',
] as const;

/**
 * Convierte un Buffer a string IP (x.x.x.x)
 */
function bufferToIp(buf: Buffer): string {
  if (buf.length === 4) {
    return `${buf[0]}.${buf[1]}.${buf[2]}.${buf[3]}`;
  }
  return buf.toString('utf-8'); // Fallback
}

/**
 * Convierte un Buffer a MAC Address (HH:HH:HH:HH:HH:HH)
 */
function bufferToMac(buf: Buffer): string {
  if (buf.length === 0) return '';
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(':');
}

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  const isBuffer = Buffer.isBuffer(value);

  // Manejo de Direcciones IP
  if (
    [
      'ipAdEntAddr',
      'ipAdEntNetMask',
      'ipAdEntBcastAddr',
      'ipNetToMediaNetAddress',
    ].includes(name)
  ) {
    if (isBuffer) return bufferToIp(value);
    return String(value);
  }

  // Manejo de Direcciones Físicas (MAC)
  if (name === 'ipNetToMediaPhysAddress') {
    if (isBuffer) return bufferToMac(value);
    return String(value);
  }

  // Enteros
  if (
    [
      'ipAdEntIfIndex',
      'ipAdEntReasmMaxSize',
      'ipNetToMediaIfIndex',
      'ipNetToMediaType',
    ].includes(name)
  ) {
    if (isBuffer) {
      return parseInt(value.toString('utf-8') || '0', 10);
    }
    return parseInt(String(value), 10);
  }

  // Default string
  if (isBuffer) return value.toString('utf-8');
  return String(value);
}

export async function pollIpSnmp(deviceId?: number) {
  console.time('pollIpSnmp');

  // 1. Obtener definiciones
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, TARGET_COLUMNS));

  if (metrics.length === 0) {
    console.warn('[IP Poll] No metrics defined for IP-MIB.');
    return;
  }

  // 2. Dispositivos
  const devices = await db.query.deviceTable.findMany({
    where: deviceId ? eq(deviceTable.id, deviceId) : undefined,
    with: { snmpAuth: true },
  });

  for (const device of devices) {
    if (!device.snmpAuth) continue;

    try {
      // Upsert ipSnmpRecord
      await db
        .insert(ipSnmpTable)
        .values({ deviceId: device.id })
        .onConflictDoNothing({ target: ipSnmpTable.deviceId });

      const [ipSnmpRecord] = await db
        .select()
        .from(ipSnmpTable)
        .where(eq(ipSnmpTable.deviceId, device.id));

      if (!ipSnmpRecord) continue;

      // Paralelizar walks
      const promises = metrics.map(async (metric) => {
        try {
          const result = await walkSNMP(
            device.ipv4,
            device.snmpAuth!,
            metric.oidBase,
          );
          return { name: metric.name, result };
        } catch (error) {
          return { name: metric.name, result: [] };
        }
      });

      const data = await Promise.all(promises);

      // Agrupadores por sufijo de OID (Row Index)
      const ipAddrMap = new Map<string, Record<string, unknown>>();
      const netToMediaMap = new Map<string, Record<string, unknown>>();

      for (const { name, result } of data) {
        const isIpAddr = name.startsWith('ipAdEnt');
        const isNetToMedia = name.startsWith('ipNetToMedia');

        const metricDef = metrics.find((m) => m.name === name);
        if (!metricDef) continue;
        const baseLen = metricDef.oidBase.split('.').length;

        for (const varbind of result) {
          const oidParts = varbind.oid.split('.');
          const indexKey = oidParts.slice(baseLen).join('.');

          if (!indexKey) continue;

          if (isIpAddr) {
            if (!ipAddrMap.has(indexKey)) ipAddrMap.set(indexKey, {});
            const item = ipAddrMap.get(indexKey)!;
            item[name] = formatValue(name, varbind.value);
          } else if (isNetToMedia) {
            if (!netToMediaMap.has(indexKey)) netToMediaMap.set(indexKey, {});
            const item = netToMediaMap.get(indexKey)!;
            item[name] = formatValue(name, varbind.value);
          }
        }
      }

      const ipList = Array.from(ipAddrMap.values());
      const netList = Array.from(netToMediaMap.values());
      const timestamp = new Date();

      // Upsert ipAddrEntry
      if (ipList.length > 0) {
        const entries = ipList.map((row: any) => ({
          ipSnmpId: ipSnmpRecord.id,
          time: timestamp,
          ipAdEntAddr: row.ipAdEntAddr || '',
          ipAdEntIfIndex: Number(row.ipAdEntIfIndex) || 0,
          ipAdEntNetMask: row.ipAdEntNetMask || '',
          ipAdEntBcastAddr: row.ipAdEntBcastAddr || '',
          ipAdEntReasmMaxSize: Number(row.ipAdEntReasmMaxSize) || 0,
        }));

        await db
          .insert(ipAddrEntryTable)
          .values(entries)
          .onConflictDoUpdate({
            target: [ipAddrEntryTable.ipSnmpId, ipAddrEntryTable.ipAdEntAddr],
            set: {
              time: timestamp,
              ipAdEntIfIndex: sql.raw('EXCLUDED.ip_ad_ent_if_index'),
              ipAdEntNetMask: sql.raw('EXCLUDED.ip_ad_ent_net_mask'),
              ipAdEntBcastAddr: sql.raw('EXCLUDED.ip_ad_ent_bcast_addr'),
              ipAdEntReasmMaxSize: sql.raw('EXCLUDED.ip_ad_ent_reasm_max_size'),
            },
          });
      }

      // Upsert ipNetToMediaTable
      if (netList.length > 0) {
        const entries = netList.map((row: any) => ({
          ipSnmpId: ipSnmpRecord.id,
          time: timestamp,
          ipNetToMediaIfIndex: Number(row.ipNetToMediaIfIndex) || 0,
          ipNetToMediaPhysAddress: row.ipNetToMediaPhysAddress || '',
          ipNetToMediaNetAddress: row.ipNetToMediaNetAddress || '',
          ipNetToMediaType: Number(row.ipNetToMediaType) || 0,
        }));

        await db
          .insert(ipNetToMediaTable)
          .values(entries)
          .onConflictDoUpdate({
            target: [
              ipNetToMediaTable.ipSnmpId,
              ipNetToMediaTable.ipNetToMediaIfIndex,
              ipNetToMediaTable.ipNetToMediaNetAddress,
            ],
            set: {
              time: timestamp,
              ipNetToMediaPhysAddress: sql.raw(
                'EXCLUDED.ip_net_to_media_phys_address',
              ),
              ipNetToMediaMediaType: sql.raw('EXCLUDED.ip_net_to_media_type'),
            },
          });
      }

      console.log(
        `[IP Poll] ${device.ipv4}: Insertadas/Actualizadas ${ipList.length} IPs y ${netList.length} ARPs.`,
      );
    } catch (error) {
      console.error(`Error procesando IP SNMP de ${device.ipv4}:`, error);
    }
  }

  console.timeEnd('pollIpSnmp');
}
