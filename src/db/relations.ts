import { defineRelations } from 'drizzle-orm';
import * as schema from '@/db';

export const relations = defineRelations(schema, (r) => ({
  deviceTable: {
    subnetTable: r.one.deviceTable({
      from: r.deviceTable.subnetId,
      to: r.deviceTable.id,
    }),
    snmpTable: r.one.deviceTable({
      from: r.deviceTable.snmpId,
      to: r.deviceTable.id,
    }),
  },
  subnetTable: {
    deviceTable: r.many.deviceTable(),
  },
  snmpTable: {
    deviceTable: r.many.deviceTable(),
  },
}));
