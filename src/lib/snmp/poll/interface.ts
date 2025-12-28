import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  interfaceTable,
  interfaceDataTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP } from '@/lib/snmp';

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
  console.time('pollInterfaces');

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

  // Procesar cada dispositivo
  for (const device of devices) {
    try {
      // Paralelizar las peticiones SNMP
      const promises = metrics.map(async (metric) => {
        try {
          const result = await walkSNMP(
            device.ipv4,
            device.snmpAuth,
            metric.oidBase,
          );
          return { name: metric.name, result };
        } catch (error) {
          return { name: metric.name, result: [] };
        }
      });

      const data = await Promise.all(promises);

      // Agrupar por ifIndex
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

          if (Buffer.isBuffer(varbind.value)) {
            if (name === 'ifPhysAddress') {
              value = Array.from(varbind.value)
                .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
                .join(':');
            } else if (['ifIndex', 'ifType', 'ifMtu'].includes(name)) {
              value = parseInt(varbind.value.toString('utf-8') || '0', 10);
            } else {
              value = varbind.value.toString('utf8');
            }
          }
          iface[name] = value;
        }
      }

      const interfacesList = Array.from(interfacesMap.values());

      if (interfacesList.length === 0) continue;

      // Paso 1: Upsert Interfaces Estáticas
      await db
        .insert(interfaceTable)
        .values(
          interfacesList.map((iface: any) => ({
            deviceId: device.id,
            ifIndex: iface.ifIndex,
            ifDescr: iface.ifDescr?.toString(),
            ifName: iface.ifName?.toString(),
            ifType: Number(iface.ifType) || null,
            ifMtu: Number(iface.ifMtu) || null,
            ifSpeed: iface.ifSpeed?.toString(),
            ifPhysAddress: iface.ifPhysAddress?.toString(),
          })),
        )
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
        await db.insert(interfaceDataTable).values(telemetryData);
      }
    } catch (error) {
      console.error(`Error procesando dispositivo ${device.ipv4}:`, error);
    }
  }

  console.timeEnd('pollInterfaces');
}
