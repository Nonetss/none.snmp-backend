import { deviceTable, interfaceTable, lldpNeighborTable } from '@/db';
import { eq } from 'drizzle-orm';
import { Handler } from 'hono';
import { db } from '@/core/config';
import { alias } from 'drizzle-orm/pg-core';

export const getConnectionGraphHandler: Handler = async (c) => {
  // Alias para permitir joins múltiples sobre las mismas tablas
  const remoteDeviceAlias = alias(deviceTable, 'remote_device');
  const localInterfaceAlias = alias(interfaceTable, 'local_interface');
  const remoteInterfaceAlias = alias(interfaceTable, 'remote_interface');

  const connections = await db
    .select({
      id: lldpNeighborTable.id,
      // Source (Local)
      sourceDeviceId: lldpNeighborTable.deviceId,
      sourceDeviceName: deviceTable.name,
      sourceDeviceIp: deviceTable.ipv4,
      sourceInterfaceId: lldpNeighborTable.interfaceId,
      sourceInterfaceName: localInterfaceAlias.ifName,
      sourceInterfaceDescr: localInterfaceAlias.ifDescr,

      // Destination (Resolved in DB)
      targetDeviceId: lldpNeighborTable.remoteDeviceId,
      targetDeviceName: remoteDeviceAlias.name,
      targetInterfaceId: lldpNeighborTable.remoteInterfaceId,
      targetInterfaceName: remoteInterfaceAlias.ifName,

      // Raw Neighbor Info (LLDP data)
      neighborSysName: lldpNeighborTable.sysName,
      neighborChassisId: lldpNeighborTable.chassisId,
      neighborPortId: lldpNeighborTable.portId,
      neighborPortDesc: lldpNeighborTable.portDesc,
      neighborMgmtAddr: lldpNeighborTable.mgmtAddress,
    })
    .from(lldpNeighborTable)
    .innerJoin(deviceTable, eq(lldpNeighborTable.deviceId, deviceTable.id))
    .leftJoin(
      localInterfaceAlias,
      eq(lldpNeighborTable.interfaceId, localInterfaceAlias.id),
    )
    .leftJoin(
      remoteDeviceAlias,
      eq(lldpNeighborTable.remoteDeviceId, remoteDeviceAlias.id),
    )
    .leftJoin(
      remoteInterfaceAlias,
      eq(lldpNeighborTable.remoteInterfaceId, remoteInterfaceAlias.id),
    );

  const nodesMap = new Map();
  const edges = [];

  for (const conn of connections) {
    // 1. Agregar Nodo Origen (Siempre es un dispositivo gestionado)
    const sourceNodeId = `dev-${conn.sourceDeviceId}`;
    if (!nodesMap.has(sourceNodeId)) {
      nodesMap.set(sourceNodeId, {
        id: sourceNodeId,
        label: conn.sourceDeviceName || conn.sourceDeviceIp,
        ip: conn.sourceDeviceIp,
        type: 'managed',
      });
    }

    // 2. Determinar y Agregar Nodo Destino
    let targetNodeId;
    if (conn.targetDeviceId) {
      targetNodeId = `dev-${conn.targetDeviceId}`;
      if (!nodesMap.has(targetNodeId)) {
        nodesMap.set(targetNodeId, {
          id: targetNodeId,
          label: conn.targetDeviceName || 'Unknown Managed',
          type: 'managed',
        });
      }
    } else {
      // Vecino no registrado en nuestra base de datos
      targetNodeId = `ext-${conn.neighborChassisId || conn.neighborSysName || conn.id}`;
      if (!nodesMap.has(targetNodeId)) {
        nodesMap.set(targetNodeId, {
          id: targetNodeId,
          label:
            conn.neighborSysName || conn.neighborChassisId || 'External Device',
          type: 'unmanaged',
          mgmtAddress: conn.neighborMgmtAddr,
        });
      }
    }

    // 3. Crear el Enlace (Edge)
    edges.push({
      id: `edge-${conn.id}`,
      source: sourceNodeId,
      target: targetNodeId,
      metadata: {
        sourceInterface:
          conn.sourceInterfaceName || conn.sourceInterfaceDescr || 'Unknown',
        targetInterface:
          conn.targetInterfaceName || conn.neighborPortId || 'Unknown',
        protocol: 'lldp',
        sysName: conn.neighborSysName,
      },
    });
  }

  return c.json({
    nodes: Array.from(nodesMap.values()),
    edges,
  });
};
