import { defineRelations } from 'drizzle-orm';
import * as schema from '@/db';

export const relations = defineRelations(schema, (r) => ({
  deviceTable: {
    subnetTable: r.one.deviceTable({
      from: r.deviceTable.subnetId,
      to: r.deviceTable.id,
    }),
    deviceTable: r.many.deviceTable(),
  },
}));
