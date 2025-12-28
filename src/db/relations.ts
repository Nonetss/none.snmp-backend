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
    data: r.many.snmpDataTable({
      from: r.deviceMetricInstancesTable.id,
      to: r.snmpDataTable.deviceMetricInstanceId,
    }),
  },
  snmpDataTable: {
    instance: r.one.deviceMetricInstancesTable({
      from: r.snmpDataTable.deviceMetricInstanceId,
      to: r.deviceMetricInstancesTable.id,
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
}));
