import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  bridgeBaseTable,
  bridgePortTable,
  bridgeFdbTable,
} from '@/db';
import { inArray, eq } from 'drizzle-orm';
import { walkSNMP, getSNMP } from '@/lib/snmp';

const BASE_METRICS = [
  'dot1dBaseBridgeAddress',
  'dot1dBaseNumPorts',
  'dot1dBaseType',
] as const;

const PORT_METRICS = ['dot1dBasePort', 'dot1dBasePortIfIndex'] as const;

const FDB_METRICS = [
  'dot1dTpFdbAddress',
  'dot1dTpFdbPort',
  'dot1dTpFdbStatus',
] as const;

export async function pollBridge(deviceId?: number) {
  console.time('pollBridge');

  // 1. Obtener definiciones de métricas
  const allMetricNames = [
    ...BASE_METRICS,
    ...PORT_METRICS,
    ...FDB_METRICS,
  ] as string[];
  const metrics = await db
    .select()
    .from(metricObjectsTable)
    .where(inArray(metricObjectsTable.name, allMetricNames));

  const metricsMap = new Map(metrics.map((m) => [m.name, m]));

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
  console.log(`[Bridge Poll] Processing ${devices.length} devices...`);

  const CONCURRENCY_LIMIT = 5;

  const processDevice = async (device: (typeof devices)[0]) => {
    try {
      // --- A. Base Info (Scalars) ---
      const baseMetrics = BASE_METRICS.map((name) =>
        metricsMap.get(name),
      ).filter(Boolean) as any[];
      if (baseMetrics.length > 0) {
        try {
          const baseRes = await getSNMP(
            device.ipv4,
            device.snmpAuth,
            baseMetrics.map((m) => m.oidBase + '.0'),
            2000,
          );

          const baseData: any = {};
          baseRes.forEach((vb, i) => {
            const name = baseMetrics[i].name;
            let val = vb.value;
            if (Buffer.isBuffer(val)) {
              if (name === 'dot1dBaseBridgeAddress') {
                val = Array.from(val)
                  .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
                  .join(':');
              } else {
                val = val.toString('utf-8');
              }
            }
            baseData[name] = val;
          });

          await db
            .insert(bridgeBaseTable)
            .values({
              deviceId: device.id,
              bridgeAddress: baseData.dot1dBaseBridgeAddress,
              numPorts: Number(baseData.dot1dBaseNumPorts),
              type: Number(baseData.dot1dBaseType),
            })
            .onConflictDoUpdate({
              target: [bridgeBaseTable.deviceId],
              set: {
                bridgeAddress: baseData.dot1dBaseBridgeAddress,
                numPorts: Number(baseData.dot1dBaseNumPorts),
                type: Number(baseData.dot1dBaseType),
                updatedAt: new Date(),
              },
            });
        } catch (e) {
          // Si falla base info, quizás no es un switch o no soporta Bridge MIB
        }
      }

      // --- B. Port Table (Logic to Physical Mapping) ---
      const portMetrics = PORT_METRICS.map((name) =>
        metricsMap.get(name),
      ).filter(Boolean) as any[];
      if (portMetrics.length > 0) {
        const portPromises = portMetrics.map((m) =>
          walkSNMP(device.ipv4, device.snmpAuth, m.oidBase, 3000),
        );
        const portResults = await Promise.all(portPromises);

        const portsMap = new Map<number, any>();
        portResults.forEach((res, i) => {
          const name = portMetrics[i].name;
          res.forEach((vb) => {
            const parts = vb.oid.split('.');
            const bridgePortIdx = parseInt(parts[parts.length - 1], 10);
            if (!portsMap.has(bridgePortIdx))
              portsMap.set(bridgePortIdx, { bridgePort: bridgePortIdx });
            portsMap.get(bridgePortIdx)[name] = vb.value;
          });
        });

        const portEntries = Array.from(portsMap.values());
        if (portEntries.length > 0) {
          await db
            .insert(bridgePortTable)
            .values(
              portEntries.map((p) => ({
                deviceId: device.id,
                bridgePort: p.bridgePort,
                ifIndex: Number(p.dot1dBasePortIfIndex),
              })),
            )
            .onConflictDoUpdate({
              target: [bridgePortTable.deviceId, bridgePortTable.bridgePort],
              set: {
                ifIndex: sql`EXCLUDED.if_index`,
                updatedAt: new Date(),
              },
            });
        }
      }

      // --- C. FDB Table (MAC Addresses) ---
      const fdbMetrics = FDB_METRICS.map((name) => metricsMap.get(name)).filter(
        Boolean,
      ) as any[];
      if (fdbMetrics.length > 0) {
        // Solo necesitamos dot1dTpFdbPort y dot1dTpFdbStatus para mapear MACs.
        // La MAC está codificada en el OID.
        const fdbPromises = fdbMetrics.map((m) =>
          walkSNMP(device.ipv4, device.snmpAuth, m.oidBase, 3000),
        );
        const fdbResults = await Promise.all(fdbPromises);

        const fdbMap = new Map<string, any>();
        fdbResults.forEach((res, i) => {
          const name = fdbMetrics[i].name;
          res.forEach((vb) => {
            const parts = vb.oid.split('.');
            // Los últimos 6 segmentos son la MAC en decimal
            const macParts = parts.slice(-6);
            if (macParts.length !== 6) return;
            const mac = macParts
              .map((p) =>
                parseInt(p, 10).toString(16).padStart(2, '0').toUpperCase(),
              )
              .join(':');

            if (!fdbMap.has(mac)) fdbMap.set(mac, { address: mac });
            fdbMap.get(mac)[name] = vb.value;
          });
        });

        const fdbEntries = Array.from(fdbMap.values());
        if (fdbEntries.length > 0) {
          await db
            .insert(bridgeFdbTable)
            .values(
              fdbEntries.map((f) => ({
                deviceId: device.id,
                address: f.address,
                port: Number(f.dot1dTpFdbPort),
                status: Number(f.dot1dTpFdbStatus),
              })),
            )
            .onConflictDoUpdate({
              target: [bridgeFdbTable.deviceId, bridgeFdbTable.address],
              set: {
                port: sql`EXCLUDED.port`,
                status: sql`EXCLUDED.status`,
                updatedAt: new Date(),
              },
            });
        }
      }
      console.log(`[Bridge Poll] ${device.ipv4}: Success`);
    } catch (error) {
      console.error(`[Bridge Poll] Error ${device.ipv4}:`, error);
    }
  };

  // Import sql for onConflictDoUpdate
  const { sql } = await import('drizzle-orm');

  for (let i = 0; i < devices.length; i += CONCURRENCY_LIMIT) {
    const batch = devices.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(batch.map(processDevice));
  }

  console.timeEnd('pollBridge');
}
