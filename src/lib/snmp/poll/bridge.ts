import { db } from '@/core/config';
import {
  metricObjectsTable,
  deviceTable,
  snmpAuthTable,
  bridgeBaseTable,
  bridgePortTable,
  bridgeFdbTable,
  vlanTable,
  bridgeFdbQTable,
} from '@/db';
import { inArray, eq, sql } from 'drizzle-orm';
import { walkSNMP, getSNMP, sanitizeString } from '@/lib/snmp';

const BASE_METRICS = [
  'dot1dBaseBridgeAddress',
  'dot1dBaseNumPorts',
  'dot1dBaseType',
] as const;

const PORT_METRICS = [
  'dot1dBasePort',
  'dot1dBasePortIfIndex',
  'dot1qPvid',
] as const;

const VLAN_METRICS = [
  'dot1qVlanStaticName',
  'dot1qVlanStaticEgressPorts',
  'dot1qVlanStaticUntaggedPorts',
] as const;

const FDB_METRICS = [
  'dot1dTpFdbAddress',
  'dot1dTpFdbPort',
  'dot1dTpFdbStatus',
] as const;

const FDB_Q_METRICS = ['dot1qTpFdbPort', 'dot1qTpFdbStatus'] as const;

export async function pollBridge(deviceId?: number) {
  console.time('pollBridge');

  // 1. Obtener definiciones de métricas
  const allMetricNames = [
    ...BASE_METRICS,
    ...PORT_METRICS,
    ...VLAN_METRICS,
    ...FDB_METRICS,
    ...FDB_Q_METRICS,
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
                val = sanitizeString(val);
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
          // No bridge support
        }
      }

      // --- B. Port Table (Mapping & PVID) ---
      const portMetrics = PORT_METRICS.map((name) =>
        metricsMap.get(name),
      ).filter(Boolean) as any[];
      if (portMetrics.length > 0) {
        const portResults = await Promise.all(
          portMetrics.map((m) =>
            walkSNMP(device.ipv4, device.snmpAuth, m.oidBase, 3000),
          ),
        );

        const portsMap = new Map<number, any>();
        portResults.forEach((res, i) => {
          const name = portMetrics[i].name;
          res.forEach((vb) => {
            const parts = vb.oid.split('.');
            const idx = parseInt(parts[parts.length - 1], 10);
            if (!portsMap.has(idx)) portsMap.set(idx, { bridgePort: idx });
            portsMap.get(idx)[name] = vb.value;
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
                ifIndex: p.dot1dBasePortIfIndex
                  ? Number(p.dot1dBasePortIfIndex)
                  : null,
                pvid: p.dot1qPvid ? Number(p.dot1qPvid) : null,
              })),
            )
            .onConflictDoUpdate({
              target: [bridgePortTable.deviceId, bridgePortTable.bridgePort],
              set: {
                ifIndex: sql`EXCLUDED.if_index`,
                pvid: sql`EXCLUDED.pvid`,
                updatedAt: new Date(),
              },
            });
        }
      }

      // --- C. VLAN Table (Inventory) ---
      const vlanMetrics = VLAN_METRICS.map((name) =>
        metricsMap.get(name),
      ).filter(Boolean) as any[];
      if (vlanMetrics.length > 0) {
        const vlanResults = await Promise.all(
          vlanMetrics.map((m) =>
            walkSNMP(device.ipv4, device.snmpAuth, m.oidBase, 3000),
          ),
        );

        const vlansMap = new Map<number, any>();
        vlanResults.forEach((res, i) => {
          const name = vlanMetrics[i].name;
          res.forEach((vb) => {
            const parts = vb.oid.split('.');
            const vlanId = parseInt(parts[parts.length - 1], 10);
            if (!vlansMap.has(vlanId)) vlansMap.set(vlanId, { vlanId });

            let val = vb.value;
            if (Buffer.isBuffer(val)) {
              if (name.includes('Ports')) {
                val = val.toString('hex').toUpperCase();
              } else {
                val = sanitizeString(val);
              }
            }
            vlansMap.get(vlanId)[name] = val;
          });
        });

        const vlanEntries = Array.from(vlansMap.values());
        if (vlanEntries.length > 0) {
          await db
            .insert(vlanTable)
            .values(
              vlanEntries.map((v) => ({
                deviceId: device.id,
                vlanId: v.vlanId,
                name: v.dot1qVlanStaticName,
                egressPorts: v.dot1qVlanStaticEgressPorts,
                untaggedPorts: v.dot1qVlanStaticUntaggedPorts,
              })),
            )
            .onConflictDoUpdate({
              target: [vlanTable.deviceId, vlanTable.vlanId],
              set: {
                name: sql`EXCLUDED.name`,
                egressPorts: sql`EXCLUDED.egress_ports`,
                untaggedPorts: sql`EXCLUDED.untagged_ports`,
                updatedAt: new Date(),
              },
            });
        }
      }

      // --- D. FDB Table (MAC Addresses - Transparent) ---
      const fdbMetrics = FDB_METRICS.map((name) => metricsMap.get(name)).filter(
        Boolean,
      ) as any[];
      if (fdbMetrics.length > 0) {
        const fdbResults = await Promise.all(
          fdbMetrics.map((m) =>
            walkSNMP(device.ipv4, device.snmpAuth, m.oidBase, 3000),
          ),
        );

        const fdbMap = new Map<string, any>();
        fdbResults.forEach((res, i) => {
          const name = fdbMetrics[i].name;
          res.forEach((vb) => {
            const parts = vb.oid.split('.');
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

      // --- E. FDB Q Table (MAC Addresses - VLAN Aware) ---
      const fdbQMetrics = FDB_Q_METRICS.map((name) =>
        metricsMap.get(name),
      ).filter(Boolean) as any[];
      if (fdbQMetrics.length > 0) {
        const fdbQResults = await Promise.all(
          fdbQMetrics.map((m) =>
            walkSNMP(device.ipv4, device.snmpAuth, m.oidBase, 3000),
          ),
        );

        const fdbQMap = new Map<string, any>();
        fdbQResults.forEach((res, i) => {
          const name = fdbQMetrics[i].name;
          const metricDef = fdbQMetrics[i];
          const baseLen = metricDef.oidBase.split('.').length;

          res.forEach((vb) => {
            const parts = vb.oid.split('.');
            const indexParts = parts.slice(baseLen);
            if (indexParts.length < 7) return;

            const vlanId = parseInt(indexParts[0], 10);
            const mac = indexParts
              .slice(1, 7)
              .map((p) =>
                parseInt(p, 10).toString(16).padStart(2, '0').toUpperCase(),
              )
              .join(':');

            const key = `${vlanId}_${mac}`;
            if (!fdbQMap.has(key)) fdbQMap.set(key, { vlanId, address: mac });
            fdbQMap.get(key)[name] = vb.value;
          });
        });

        const fdbQEntries = Array.from(fdbQMap.values());
        if (fdbQEntries.length > 0) {
          await db
            .insert(bridgeFdbQTable)
            .values(
              fdbQEntries.map((f) => ({
                deviceId: device.id,
                vlanId: f.vlanId,
                address: f.address,
                port: Number(f.dot1qTpFdbPort),
                status: Number(f.dot1qTpFdbStatus),
              })),
            )
            .onConflictDoUpdate({
              target: [
                bridgeFdbQTable.deviceId,
                bridgeFdbQTable.vlanId,
                bridgeFdbQTable.address,
              ],
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

  for (let i = 0; i < devices.length; i += CONCURRENCY_LIMIT) {
    const batch = devices.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(batch.map(processDevice));
  }

  console.timeEnd('pollBridge');
}
