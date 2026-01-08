import { db } from '@/core/config';
import {
  monitorRuleTable,
  monitorGroupTable,
  monitorPortGroupTable,
} from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getMonitorRuleRoute } from './get.route';

export const getMonitorRuleHandler: RouteHandler<
  typeof getMonitorRuleRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const ruleId = parseInt(id, 10);

    const [rule] = await db
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
      )
      .where(eq(monitorRuleTable.id, ruleId));

    if (!rule) {
      return c.json({ message: 'Rule not found' }, 404) as any;
    }

    return c.json(
      {
        ...rule,
        deviceGroup: {
          ...rule.deviceGroup,
          createdAt: rule.deviceGroup.createdAt.toISOString(),
        },
      },
      200,
    );
  } catch (error) {
    console.error('[Get Monitor Rule] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
