import { db } from '@/core/config';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listMonitorRulesRoute } from './list.route';

export const listMonitorRulesHandler: RouteHandler<
  typeof listMonitorRulesRoute
> = async (c) => {
  try {
    const rules = await db.query.monitorRuleTable.findMany({
      with: {
        deviceGroup: {
          with: {
            devices: true,
          },
        },
        portGroup: {
          with: {
            items: true,
          },
        },
      },
    });

    return c.json(
      rules.map((r) => ({
        ...r,
        status: (r.status as any) || 'idle',
        lastRun: r.lastRun?.toISOString() || null,
        nextRun: r.nextRun?.toISOString() || null,
        deviceGroup: {
          id: r.deviceGroup.id,
          name: r.deviceGroup.name,
          description: r.deviceGroup.description,
          deviceCount: r.deviceGroup.devices.length,
          createdAt: r.deviceGroup.createdAt.toISOString(),
        },
        portGroup: {
          id: r.portGroup.id,
          name: r.portGroup.name,
          description: r.portGroup.description,
          portCount: r.portGroup.items.length,
        },
      })),
      200,
    );
  } catch (error) {
    console.error('[List Monitor Rules] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
