import { db } from '@/core/config';
import {
  monitorRuleTable,
  monitorGroupTable,
  monitorPortGroupTable,
} from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listMonitorRulesRoute } from './list.route';

export const listMonitorRulesHandler: RouteHandler<
  typeof listMonitorRulesRoute
> = async (c) => {
  try {
    const rules = await db
      .select({
        id: monitorRuleTable.id,
        name: monitorRuleTable.name,
        deviceGroupId: monitorRuleTable.deviceGroupId,
        portGroupId: monitorRuleTable.portGroupId,
        enabled: monitorRuleTable.enabled,
        deviceGroup: monitorGroupTable,
        portGroup: monitorPortGroupTable,
      })
      .from(monitorRuleTable)
      .innerJoin(
        monitorGroupTable,
        eq(monitorRuleTable.deviceGroupId, monitorGroupTable.id),
      )
      .innerJoin(
        monitorPortGroupTable,
        eq(monitorRuleTable.portGroupId, monitorPortGroupTable.id),
      );

    return c.json(
      rules.map((r) => ({
        ...r,
        deviceGroup: {
          ...r.deviceGroup,
          createdAt: r.deviceGroup.createdAt.toISOString(),
        },
      })),
      200,
    );
  } catch (error) {
    console.error('[List Monitor Rules] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
