import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  systemTable as deviceSystemTable, // Alias para evitar conflicto si hubiera
} from '@/db';
import { inArray, sql } from 'drizzle-orm';
import { walkSNMP } from '@/lib/snmp';

// Columnas objetivo de la tabla system
const TARGET_COLUMNS = [
  'sysDescr',
  'sysUpTime',
  'sysContact',
  'sysName',
  'sysLocation',
  'sysServices',
] as const;

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  if (Buffer.isBuffer(value)) {
    if (name === 'sysServices') {
      return parseInt(value.toString('utf-8') || '0', 10);
    }
    return value.toString('utf-8');
  }

  if (name === 'sysServices') {
    return parseInt(String(value), 10);
  }

  return String(value);
}

export async function pollSystem(deviceId?: number) {
  console.time('pollSystem');

  // 1. Obtener definiciones
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, TARGET_COLUMNS));

  if (metrics.length === 0) {
    console.warn('[System Poll] No metrics defined for System MIB.');
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
      // Paralelizar peticiones
      // Dado que son escalares, walk devuelve 1 resultado idealmente.
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

      const systemData: Record<string, any> = {};

      for (const { name, result } of data) {
        if (result.length > 0) {
          const varbind = result[0]; // Tomamos el primero
          let val = varbind.value;

          // Manejo especial para sysUpTime (TimeTicks -> Timestamp de arranque)
          if (name === 'sysUpTime') {
            // TimeTicks viene en centésimas de segundo (1/100 s)
            const ticks =
              typeof val === 'number' ? val : parseInt(String(val), 10);
            if (!isNaN(ticks)) {
              // Calculamos fecha de arranque aproximada: Ahora - Ticks
              const now = new Date();
              const bootTime = new Date(now.getTime() - ticks * 10);
              systemData[name] = bootTime;
              continue;
            }
          }

          systemData[name] = formatValue(name, val);
        }
      }

      // Si no obtuvimos nada, saltamos
      if (Object.keys(systemData).length === 0) continue;

      // Insert / Upsert
      await db
        .insert(deviceSystemTable)
        .values({
          deviceId: device.id,
          sysDescr: systemData.sysDescr,
          sysUpTime: systemData.sysUpTime, // Date object
          sysContact: systemData.sysContact,
          sysName: systemData.sysName,
          sysLocation: systemData.sysLocation,
          sysServices: systemData.sysServices,
        })
        .onConflictDoUpdate({
          target: [deviceSystemTable.deviceId],
          set: {
            sysDescr: sql.raw('EXCLUDED.sys_descr'),
            sysUpTime: sql.raw('EXCLUDED.sys_up_time'),
            sysContact: sql.raw('EXCLUDED.sys_contact'),
            sysName: sql.raw('EXCLUDED.sys_name'),
            sysLocation: sql.raw('EXCLUDED.sys_location'),
            sysServices: sql.raw('EXCLUDED.sys_services'),
          },
        });

      console.log(
        `[System Poll] ${device.ipv4}: Datos de sistema actualizados.`,
      );
    } catch (error) {
      console.error(`Error procesando System info de ${device.ipv4}:`, error);
    }
  }

  console.timeEnd('pollSystem');
}
