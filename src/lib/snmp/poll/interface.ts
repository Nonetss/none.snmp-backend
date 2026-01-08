import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  interfaceTable,
  interfaceDataTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, sanitizeString, normalizeMac } from '@/lib/snmp';
import { chunkArray } from '@/lib/db';
import { logger } from '@/lib/logger';

// Columnas que esperamos recuperar
const TARGET_COLUMNS = [
  'ifIndex',
  'ifDescr',
  'ifName',
  'ifType',
  'ifMtu',
  'ifSpeed',
  'ifPhysAddress',
  'ifAdminStatus',
  'ifOperStatus',
  'ifInOctets',
  'ifOutOctets',
  'ifInErrors',
  'ifOutErrors',
] as const;

export async function pollInterfaces(deviceId?: number) {
  // 1. Obtener definiciones de métricas
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, TARGET_COLUMNS));

  // 2. Obtener dispositivo(s) con select estándar
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
  logger.info(`[Interface Poll] Processing ${devices.length} devices...`);

  const CONCURRENCY_LIMIT = 5; // Menor concurrencia porque interfaces pide muchos OIDs

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
      // Paralelizar las peticiones SNMP
      const promises = metrics.map(async (metric) => {
        try {
          const result = await walkSNMP(
            device.ipv4,
            device.snmpAuth,
            metric.oidBase,
            3000,
          );
          return { name: metric.name, result };
        } catch (error) {
          return { name: metric.name, result: [] };
        }
      });

      const data = await Promise.all(promises);
      // ... resto de la lógica de agrupamiento ...
      const interfacesMap = new Map<number, Record<string, unknown>>();

      for (const { name, result } of data) {
        for (const varbind of result) {
          const oidParts = varbind.oid.split('.');
          const ifIndexStr = oidParts[oidParts.length - 1];
          const ifIndex = parseInt(ifIndexStr, 10);

          if (isNaN(ifIndex)) continue;

          if (!interfacesMap.has(ifIndex)) {
            interfacesMap.set(ifIndex, { ifIndex });
          }

          const iface = interfacesMap.get(ifIndex)!;
          let value: unknown = varbind.value;

          if (name === 'ifPhysAddress') {
            value = normalizeMac(varbind.value);
          } else if (Buffer.isBuffer(varbind.value)) {
            if (['ifIndex', 'ifType', 'ifMtu'].includes(name)) {
              value = parseInt(varbind.value.toString('utf-8') || '0', 10);
            } else {
              value = sanitizeString(varbind.value);
            }
          } else {
            if (['ifIndex', 'ifType', 'ifMtu'].includes(name)) {
              value = parseInt(String(varbind.value) || '0', 10);
            } else {
              value = sanitizeString(varbind.value);
            }
          }
          iface[name] = value;
        }
      }

      const interfacesListRaw = Array.from(interfacesMap.values());

      if (interfacesListRaw.length === 0) {
        logger.info(`[Interface Poll] ${device.ipv4}: No interfaces found`);
        return;
      }

      // --- DEDUPLICACIÓN POR MAC (REQUISITO: 1 MAC por Dispositivo) ---
      const finalInterfacesMap = new Map<number, any>();
      const macToBestIndex = new Map<
        string,
        { index: number; score: number }
      >();

      for (const iface of interfacesListRaw) {
        const mac = iface.ifPhysAddress?.toString().toUpperCase();
        const isJunk =
          !mac ||
          mac === '00:00:00:00:00:00' ||
          mac === '00:00:00:00:00:00:00:00';

        if (isJunk) {
          finalInterfacesMap.set(Number(iface.ifIndex), iface);
          continue;
        }

        // Puntuación para elegir la "mejor" interfaz: UP (1) suma 100 puntos, menor ifIndex suma puntos inversos
        const score =
          (iface.ifOperStatus === 1 ? 1000 : 0) - Number(iface.ifIndex);
        const existing = macToBestIndex.get(mac);

        if (!existing || score > existing.score) {
          if (existing) finalInterfacesMap.delete(existing.index);
          macToBestIndex.set(mac, { index: Number(iface.ifIndex), score });
          finalInterfacesMap.set(Number(iface.ifIndex), iface);
        }
      }

      const interfacesList = Array.from(finalInterfacesMap.values());

      // Paso 1: Upsert Interfaces Estáticas
      const staticEntries = interfacesList.map((iface: any) => ({
        deviceId: device.id,
        ifIndex: iface.ifIndex,
        ifDescr: iface.ifDescr?.toString() || null,
        ifName: iface.ifName?.toString() || null,
        ifType: Number(iface.ifType) || null,
        ifMtu: Number(iface.ifMtu) || null,
        ifSpeed: iface.ifSpeed?.toString() || null,
        ifPhysAddress: iface.ifPhysAddress?.toString() || null,
      }));

      for (const chunk of chunkArray(staticEntries, 1000)) {
        await db
          .insert(interfaceTable)
          .values(chunk)
          .onConflictDoUpdate({
            target: [interfaceTable.deviceId, interfaceTable.ifIndex],
            set: {
              ifDescr: sql`EXCLUDED.if_descr`,
              ifName: sql`EXCLUDED.if_name`,
              ifType: sql`EXCLUDED.if_type`,
              ifMtu: sql`EXCLUDED.if_mtu`,
              ifSpeed: sql`EXCLUDED.if_speed`,
              ifPhysAddress: sql`EXCLUDED.if_phys_address`,
              updatedAt: new Date(),
            },
          });
      }

      // Paso 2: Insertar Datos de Telemetría
      const dbInterfaces = await db
        .select({
          id: interfaceTable.id,
          idx: interfaceTable.ifIndex,
        })
        .from(interfaceTable)
        .where(eq(interfaceTable.deviceId, device.id));

      const idMap = new Map(dbInterfaces.map((i) => [i.idx, i.id]));

      const telemetryData = interfacesList
        .filter((iface: any) => idMap.has(iface.ifIndex))
        .map((iface: any) => ({
          interfaceId: idMap.get(iface.ifIndex)!,
          time: new Date(),
          ifAdminStatus: Number(iface.ifAdminStatus) || null,
          ifOperStatus: Number(iface.ifOperStatus) || null,
          ifInOctets: iface.ifInOctets?.toString(),
          ifOutOctets: iface.ifOutOctets?.toString(),
          ifInErrors: Number(iface.ifInErrors) || null,
          ifOutErrors: Number(iface.ifOutErrors) || null,
        }));

      if (telemetryData.length > 0) {
        for (const chunk of chunkArray(telemetryData, 1000)) {
          await db.insert(interfaceDataTable).values(chunk);
        }
      }
      logger.info(
        `[Interface Poll] ${device.ipv4}: Success (${interfacesList.length} interfaces)`,
      );
    } catch (error) {
      logger.error({ error }, `[Interface Poll] Error ${device.ipv4}`);
    }
  };

  // Procesar todos los dispositivos en paralelo
  await Promise.all(devices.map(processDevice));
}
