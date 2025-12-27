import { defineRelations } from 'drizzle-orm';
import * as schema from '@/db';

export const relations = defineRelations(schema, (r) => ({
  deviceTable: {
    subnet: r.one.subnetTable({
      from: r.deviceTable.subnetId,
      to: r.subnetTable.id,
    }),
    snmpAuth: r.one.snmpAuthTable({
      from: r.deviceTable.snmpId,
      to: r.snmpAuthTable.id,
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
      to: r.deviceTable.snmpId,
    }),
  },
  metricsDefinitionTable: {
    snmpData: r.many.snmpDataTable({
      from: r.metricsDefinitionTable.id,
      to: r.snmpDataTable.metricId,
    }),
  },
  snmpDataTable: {
    metricsDefinition: r.one.metricsDefinitionTable({
      from: r.snmpDataTable.metricId,
      to: r.metricsDefinitionTable.id,
    }),
    device: r.one.deviceTable({
      from: r.snmpDataTable.deviceId,
      to: r.deviceTable.id,
    }),
  },
}));
