import { defineRelations } from 'drizzle-orm';
import * as schema from '@/db';

export const relations = defineRelations(schema, (r) => ({
  deviceTable: {
    subnet: r.one.subnetTable({
      from: r.deviceTable.subnetId,
      to: r.subnetTable.id,
    }),
    snmpAuth: r.one.snmpAuthTable({
      from: r.deviceTable.snmpAuthId,
      to: r.snmpAuthTable.id,
    }),
    interfaces: r.many.interfaceTable({
      from: r.deviceTable.id,
      to: r.interfaceTable.deviceId,
    }),
    resources: r.many.resourceTable({
      from: r.deviceTable.id,
      to: r.resourceTable.deviceId,
    }),
    system: r.one.systemTable({
      from: r.deviceTable.id,
      to: r.systemTable.deviceId,
    }),
    bridgeBase: r.one.bridgeBaseTable({
      from: r.deviceTable.id,
      to: r.bridgeBaseTable.deviceId,
    }),
    bridgePorts: r.many.bridgePortTable({
      from: r.deviceTable.id,
      to: r.bridgePortTable.deviceId,
    }),
    bridgeFdb: r.many.bridgeFdbTable({
      from: r.deviceTable.id,
      to: r.bridgeFdbTable.deviceId,
    }),
    cdpNeighbors: r.many.cdpNeighborTable({
      from: r.deviceTable.id,
      to: r.cdpNeighborTable.deviceId,
    }),
    lldpNeighbors: r.many.lldpNeighborTable({
      from: r.deviceTable.id,
      to: r.lldpNeighborTable.deviceId,
    }),
    routes: r.many.routeTable({
      from: r.deviceTable.id,
      to: r.routeTable.deviceId,
    }),
    physicalEntities: r.many.entityPhysicalTable({
      from: r.deviceTable.id,
      to: r.entityPhysicalTable.deviceId,
    }),
    ipSnmp: r.one.ipSnmpTable({
      from: r.deviceTable.id,
      to: r.ipSnmpTable.deviceId,
    }),
  },
  subnetTable: {
    devices: r.many.deviceTable({
      from: r.subnetTable.id,
      to: r.deviceTable.subnetId,
    }),
  },
  snmpAuthTable: {
    devices: r.many.deviceTable({
      from: r.snmpAuthTable.id,
      to: r.deviceTable.snmpAuthId,
    }),
  },
  metricsDefinitionTable: {
    objects: r.many.metricObjectsTable({
      from: r.metricsDefinitionTable.id,
      to: r.metricObjectsTable.metricsDefinitionId,
    }),
  },
  metricObjectsTable: {
    definition: r.one.metricsDefinitionTable({
      from: r.metricObjectsTable.metricsDefinitionId,
      to: r.metricsDefinitionTable.id,
    }),
  },
  interfaceTable: {
    device: r.one.deviceTable({
      from: r.interfaceTable.deviceId,
      to: r.deviceTable.id,
    }),
    data: r.many.interfaceDataTable({
      from: r.interfaceTable.id,
      to: r.interfaceDataTable.interfaceId,
    }),
  },
  interfaceDataTable: {
    interface: r.one.interfaceTable({
      from: r.interfaceDataTable.interfaceId,
      to: r.interfaceTable.id,
    }),
  },
  resourceTable: {
    device: r.one.deviceTable({
      from: r.resourceTable.deviceId,
      to: r.deviceTable.id,
    }),
    swRun: r.many.hrSWRunEntryTable({
      from: r.resourceTable.id,
      to: r.hrSWRunEntryTable.resourceId,
    }),
    swRunPerf: r.many.hrSWRunPerfEntryTable({
      from: r.resourceTable.id,
      to: r.hrSWRunPerfEntryTable.resourceId,
    }),
    swInstalled: r.many.hrSWInstalledEntryTable({
      from: r.resourceTable.id,
      to: r.hrSWInstalledEntryTable.resourceId,
    }),
  },
  hrSWRunEntryTable: {
    resource: r.one.resourceTable({
      from: r.hrSWRunEntryTable.resourceId,
      to: r.resourceTable.id,
    }),
  },
  hrSWRunPerfEntryTable: {
    resource: r.one.resourceTable({
      from: r.hrSWRunPerfEntryTable.resourceId,
      to: r.resourceTable.id,
    }),
  },
  hrSWInstalledEntryTable: {
    resource: r.one.resourceTable({
      from: r.hrSWInstalledEntryTable.resourceId,
      to: r.resourceTable.id,
    }),
  },
  systemTable: {
    device: r.one.deviceTable({
      from: r.systemTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  bridgeBaseTable: {
    device: r.one.deviceTable({
      from: r.bridgeBaseTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  bridgePortTable: {
    device: r.one.deviceTable({
      from: r.bridgePortTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  bridgeFdbTable: {
    device: r.one.deviceTable({
      from: r.bridgeFdbTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  cdpNeighborTable: {
    device: r.one.deviceTable({
      from: r.cdpNeighborTable.deviceId,
      to: r.deviceTable.id,
    }),
    localInterface: r.one.interfaceTable({
      from: r.cdpNeighborTable.interfaceId,
      to: r.interfaceTable.id,
    }),
    remoteDevice: r.one.deviceTable({
      from: r.cdpNeighborTable.remoteDeviceId,
      to: r.deviceTable.id,
    }),
    remoteInterface: r.one.interfaceTable({
      from: r.cdpNeighborTable.remoteInterfaceId,
      to: r.interfaceTable.id,
    }),
  },
  lldpNeighborTable: {
    device: r.one.deviceTable({
      from: r.lldpNeighborTable.deviceId,
      to: r.deviceTable.id,
    }),
    localInterface: r.one.interfaceTable({
      from: r.lldpNeighborTable.interfaceId,
      to: r.interfaceTable.id,
    }),
    remoteDevice: r.one.deviceTable({
      from: r.lldpNeighborTable.remoteDeviceId,
      to: r.deviceTable.id,
    }),
    remoteInterface: r.one.interfaceTable({
      from: r.lldpNeighborTable.remoteInterfaceId,
      to: r.interfaceTable.id,
    }),
  },
  routeTable: {
    device: r.one.deviceTable({
      from: r.routeTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  entityPhysicalTable: {
    device: r.one.deviceTable({
      from: r.entityPhysicalTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
  ipSnmpTable: {
    device: r.one.deviceTable({
      from: r.ipSnmpTable.deviceId,
      to: r.deviceTable.id,
    }),
    addrEntries: r.many.ipAddrEntryTable({
      from: r.ipSnmpTable.id,
      to: r.ipAddrEntryTable.ipSnmpId,
    }),
    netToMediaEntries: r.many.ipNetToMediaTable({
      from: r.ipSnmpTable.id,
      to: r.ipNetToMediaTable.ipSnmpId,
    }),
  },
  ipAddrEntryTable: {
    ipSnmp: r.one.ipSnmpTable({
      from: r.ipAddrEntryTable.ipSnmpId,
      to: r.ipSnmpTable.id,
    }),
  },
  ipNetToMediaTable: {
    ipSnmp: r.one.ipSnmpTable({
      from: r.ipNetToMediaTable.ipSnmpId,
      to: r.ipSnmpTable.id,
    }),
  },
}));
