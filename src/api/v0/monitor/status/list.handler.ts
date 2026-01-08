import { db } from '@/core/config';
import { portStatusTable } from '@/db';
import { eq, desc, and } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listPortStatusRoute } from './list.route';

export const listPortStatusHandler: RouteHandler<
  typeof listPortStatusRoute
> = async (c) => {
  try {
    const { ruleId, deviceId, limit } = c.req.valid('query');

    const filters = [];
    if (ruleId) filters.push(eq(portStatusTable.ruleId, parseInt(ruleId)));
    if (deviceId)
      filters.push(eq(portStatusTable.deviceId, parseInt(deviceId)));

    const results = await db.query.portStatusTable.findMany({
      where: filters.length > 0 ? and(...filters) : undefined,
      limit: parseInt(limit),
      orderBy: [desc(portStatusTable.checkTime)],
      with: {
        device: {
          columns: {
            id: true,
            name: true,
            ipv4: true,
          },
        },
        rule: {
          columns: {
            id: true,
            name: true,
          },
        },
        portGroupItem: true,
      },
    });

    return c.json(
      results.map((r) => ({
        ...r,
        checkTime: r.checkTime.toISOString(),
      })),
      200,
    );
  } catch (error) {
    console.error('[List Port Status] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
