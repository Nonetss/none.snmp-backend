import { db } from '@/core/config';
import { monitorRuleTable } from '@/db';
import { eq, and, gte, lte } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getRuleStatusRoute } from './get.route';

export const getRuleStatusHandler: RouteHandler<
  typeof getRuleStatusRoute
> = async (c) => {
  try {
    const { ruleId } = c.req.valid('param');
    const { deviceId, port, from, to } = c.req.valid('query');

    const rule = await db.query.monitorRuleTable.findFirst({
      where: (fields, { eq }) => eq(fields.id, parseInt(ruleId)),
      with: {
        portGroup: {
          with: { items: true },
        },
        deviceGroup: {
          with: { devices: { with: { device: true } } },
        },
        results: {
          where: (fields, { and, eq, gte, lte }) => {
            const filters = [];
            if (deviceId) filters.push(eq(fields.deviceId, parseInt(deviceId)));
            if (port) filters.push(eq(fields.port, parseInt(port)));
            if (from) filters.push(gte(fields.checkTime, new Date(from)));
            if (to) filters.push(lte(fields.checkTime, new Date(to)));
            return filters.length > 0 ? and(...filters) : undefined;
          },
          orderBy: (fields, { desc }) => [desc(fields.checkTime)],
          with: { device: true },
        },
      },
    });

    if (!rule) {
      return c.json({ message: 'Rule not found' }, 404);
    }

    const ports = rule.portGroup.items
      .filter((item) => (port ? item.port === parseInt(port) : true))
      .map((item) => {
        const devicesInGroup = rule.deviceGroup.devices.map((dg) => dg.device);

        const devices = devicesInGroup
          .filter((dev) => (deviceId ? dev.id === parseInt(deviceId) : true))
          .map((dev) => {
            const history = rule.results
              .filter(
                (r) => r.portGroupItemId === item.id && r.deviceId === dev.id,
              )
              .map((h) => ({
                checkTime: h.checkTime.toISOString(),
                status: h.status,
                responseTime: h.responseTime,
              }));

            return {
              id: dev.id,
              name: dev.name,
              ipv4: dev.ipv4,
              history,
            };
          });

        return {
          portGroupItemId: item.id,
          port: item.port,
          expectedStatus: item.expectedStatus,
          devices,
        };
      });

    return c.json(
      {
        id: rule.id,
        name: rule.name,
        enabled: rule.enabled,
        cronExpression: rule.cronExpression,
        lastRun: rule.lastRun?.toISOString() || null,
        status: rule.status,
        ports,
      },
      200,
    );
  } catch (error) {
    console.error('[Get Rule Status] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
