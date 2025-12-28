import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  hrSWRunEntryTable,
  hrSWRunPerfEntryTable,
  hrSWInstalledEntryTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP } from '@/lib/snmp';

// Columnas objetivo: Procesos en ejecución + Software Instalado
const TARGET_COLUMNS = [
  // hrSWRun (Procesos)
  'hrSWRunIndex',
  'hrSWRunName',
  'hrSWRunID',
  'hrSWRunPath',
  'hrSWRunParameters',
  'hrSWRunType',
  'hrSWRunStatus',
  'hrSWRunPerfCPU',
  'hrSWRunPerfMem',
  // hrSWInstalled (Software Instalado)
  'hrSWInstalledIndex',
  'hrSWInstalledName',
  'hrSWInstalledID',
  'hrSWInstalledType',
  'hrSWInstalledDate',
] as const;

/**
 * Parsea fechas SNMP (DateAndTime) que suelen venir como Buffer de 8 o 11 bytes.
 * Formato: 2 bytes año, 1 mes, 1 dia, 1 hora, 1 min, 1 sec, 1 deci-sec, ...
 */
function parseSnmpDate(buffer: Buffer): Date {
  if (buffer.length < 8) return new Date(); // Fallback
  const year = (buffer[0] << 8) | buffer[1];
  const month = buffer[2];
  const day = buffer[3];
  const hour = buffer[4];
  const minute = buffer[5];
  const second = buffer[6];
  // const deci = buffer[7];
  // Ignoramos timezone offset por simplicidad o asumimos UTC/Local
  return new Date(year, month - 1, day, hour, minute, second);
}

function formatValue(name: string, value: any): any {
  if (value === null || value === undefined) return null;

  if (Buffer.isBuffer(value)) {
    if (name === 'hrSWInstalledDate') {
      try {
        return parseSnmpDate(value);
      } catch {
        return new Date();
      }
    }

    // OIDs
    if (name === 'hrSWRunID' || name === 'hrSWInstalledID') {
      return value.toString();
    }
    // Enteros en buffer
    if (
      [
        'hrSWRunIndex',
        'hrSWRunType',
        'hrSWRunStatus',
        'hrSWRunPerfCPU',
        'hrSWRunPerfMem',
        'hrSWInstalledIndex',
        'hrSWInstalledType',
      ].includes(name)
    ) {
      return parseInt(value.toString('utf-8') || '0', 10);
    }
    return value.toString('utf-8');
  }

  if (name === 'hrSWInstalledDate') {
    // Si por casualidad viene ya parseado
    return new Date(String(value));
  }

  // OIDs
  if (name === 'hrSWRunID' || name === 'hrSWInstalledID') {
    return String(value);
  }

  // Enteros
  if (
    [
      'hrSWRunIndex',
      'hrSWRunType',
      'hrSWRunStatus',
      'hrSWRunPerfCPU',
      'hrSWRunPerfMem',
      'hrSWInstalledIndex',
      'hrSWInstalledType',
    ].includes(name)
  ) {
    return parseInt(String(value), 10);
  }

  return String(value);
}

export async function pollResources() {
  console.time('pollResources');

  // 1. Obtener definiciones
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, TARGET_COLUMNS));

  if (metrics.length === 0) {
    console.warn('[Resource Poll] No metrics defined for HR-SW.');
    return;
  }

  // 2. Dispositivos
  const devices = await db.query.deviceTable.findMany({
    with: { snmpAuth: true },
  });

  for (const device of devices) {
    if (!device.snmpAuth) continue;

    try {
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

      // Agrupadores
      const runMap = new Map<number, Record<string, unknown>>();
      const installedMap = new Map<number, Record<string, unknown>>();

      for (const { name, result } of data) {
        // Determinar a qué grupo pertenece la métrica
        const isRun = name.startsWith('hrSWRun');
        const isInstalled = name.startsWith('hrSWInstalled');

        for (const varbind of result) {
          const oidParts = varbind.oid.split('.');
          const idxStr = oidParts[oidParts.length - 1];
          const idx = parseInt(idxStr, 10);

          if (isNaN(idx)) continue;

          if (isRun) {
            if (!runMap.has(idx)) runMap.set(idx, { hrSWRunIndex: idx });
            const item = runMap.get(idx)!;
            item[name] = formatValue(name, varbind.value);
          } else if (isInstalled) {
            if (!installedMap.has(idx))
              installedMap.set(idx, { hrSWInstalledIndex: idx });
            const item = installedMap.get(idx)!;
            item[name] = formatValue(name, varbind.value);
          }
        }
      }

      const runList = Array.from(runMap.values());
      const installedList = Array.from(installedMap.values());

      const timestamp = new Date();

      // --- Insertar Procesos (Running) ---
      if (runList.length > 0) {
        const runEntries = runList.map((p: any) => ({
          date: timestamp,
          hrSWRunIndex: p.hrSWRunIndex,
          hrSWRunName: p.hrSWRunName || '',
          hrSWRunID: p.hrSWRunID || '0.0',
          hrSWRunPath: p.hrSWRunPath || '',
          hrSWRunParameters: p.hrSWRunParameters || '',
          hrSWRunType: Number(p.hrSWRunType) || 0,
          hrSWRunStatus: Number(p.hrSWRunStatus) || 0,
        }));
        await db.insert(hrSWRunEntryTable).values(runEntries);

        const perfEntries = runList
          .filter(
            (p: any) =>
              p.hrSWRunPerfCPU !== undefined || p.hrSWRunPerfMem !== undefined,
          )
          .map((p: any) => ({
            date: timestamp,
            hrSWRunPerfCPU: Number(p.hrSWRunPerfCPU) || 0,
            hrSWRunPerfMem: Number(p.hrSWRunPerfMem) || 0,
          }));
        if (perfEntries.length > 0) {
          await db.insert(hrSWRunPerfEntryTable).values(perfEntries);
        }
      }

      // --- Insertar Software Instalado ---
      if (installedList.length > 0) {
        const installedEntries = installedList.map((p: any) => ({
          date: timestamp,
          hrSWInstalledIndex: p.hrSWInstalledIndex,
          hrSWInstalledName: p.hrSWInstalledName || '',
          hrSWInstalledID: p.hrSWInstalledID || '0.0',
          hrSWInstalledType: Number(p.hrSWInstalledType) || 0,
          hrSWInstalledDate:
            p.hrSWInstalledDate instanceof Date
              ? p.hrSWInstalledDate
              : new Date(),
        }));
        await db.insert(hrSWInstalledEntryTable).values(installedEntries);
      }

      console.log(
        `[Resource Poll] ${device.ipv4}: Insertados ${runList.length} procesos y ${installedList.length} paquetes instalados.`,
      );
    } catch (error) {
      console.error(`Error procesando recursos de ${device.ipv4}:`, error);
    }
  }

  console.timeEnd('pollResources');
}
