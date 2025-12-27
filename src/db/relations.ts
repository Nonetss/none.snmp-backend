import { defineRelations } from 'drizzle-orm';
import * as schema from '@/db';

export const relations = defineRelations(schema, (r) => ({
  deviceTable: {
    subnetTable: r.one.deviceTable({
      from: r.deviceTable.subnetId,
      to: r.deviceTable.id,
    }),
    snmpAuthTable: r.one.deviceTable({
      from: r.deviceTable.snmpId,
      to: r.deviceTable.id,
    }),
  },
  subnetTable: {
    deviceTable: r.many.deviceTable(),
  },
  snmpAuthTable: {
    deviceTable: r.many.deviceTable(),
  },
  metricsDefinitionTable: {
    snmpDataTable: r.many.snmpDataTable(),
  },
  snmpDataTable: {
    metricsDefinitionTable: r.one.snmpDataTable({
      from: r.snmpDataTable.metricId,
      to: r.snmpDataTable.id,
    }),
    deviceTable: r.one.snmpDataTable({
      from: r.snmpDataTable.deviceId,
      to: r.snmpDataTable.id,
    }),
  },
}));
