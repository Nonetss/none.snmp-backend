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
    metricInstances: r.many.deviceMetricInstancesTable({
      from: r.deviceTable.id,
      to: r.deviceMetricInstancesTable.deviceId,
    }),
    resources: r.many.resourceTable({
      from: r.deviceTable.id,
      to: r.resourceTable.deviceId,
    }),
    system: r.one.systemTable({
      from: r.deviceTable.id,
      to: r.systemTable.deviceId,
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
    instances: r.many.deviceMetricInstancesTable({
      from: r.metricObjectsTable.id,
      to: r.deviceMetricInstancesTable.metricObjectId,
    }),
  },
  deviceMetricInstancesTable: {
    device: r.one.deviceTable({
      from: r.deviceMetricInstancesTable.deviceId,
      to: r.deviceTable.id,
    }),
    metricObject: r.one.metricObjectsTable({
      from: r.deviceMetricInstancesTable.metricObjectId,
      to: r.metricObjectsTable.id,
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
}));
