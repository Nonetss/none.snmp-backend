import { db } from '@/core/config';
import { monitorRuleTable, portStatusTable } from '@/db';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getRuleStatusRoute } from './get.route';

export const getRuleStatusHandler: RouteHandler<
  typeof getRuleStatusRoute
> = async (c) => {
  try {
    const { ruleId: ruleIdStr } = c.req.valid('param');
    const { deviceId, port, from, to } = c.req.valid('query');
    const ruleId = parseInt(ruleIdStr);

    if (isNaN(ruleId)) {
      return c.json({ message: 'Invalid rule ID' }, 400);
    }

    // Usar una consulta select directa para evitar cualquier comportamiento inesperado de findFirst
    const [rule] = await db
      .select()
      .from(monitorRuleTable)
      .where(eq(monitorRuleTable.id, ruleId));

    if (!rule) {
      return c.json({ message: 'Rule not found' }, 404);
    }

    // Obtener grupos por separado para tener control total
    const portGroup = await db.query.monitorPortGroupTable.findFirst({
      where: (fields, { eq }) => eq(fields.id, rule.portGroupId),
      with: { items: true },
    });

    const deviceGroup = await db.query.monitorGroupTable.findFirst({
      where: (fields, { eq }) => eq(fields.id, rule.deviceGroupId),
      with: { devices: { with: { device: true } } },
    });

    if (!portGroup || !deviceGroup) {
      return c.json({ message: 'Configuration for rule is missing' }, 500);
    }

    // Obtener los resultados filtrados de forma explícita
    const results = await db
      .select()
      .from(portStatusTable)
      .where(
        and(
          eq(portStatusTable.ruleId, rule.id),
          deviceId
            ? eq(portStatusTable.deviceId, parseInt(deviceId))
            : undefined,
          port ? eq(portStatusTable.port === parseInt(port)) : undefined,
          from ? gte(portStatusTable.checkTime, new Date(from)) : undefined,
          to ? lte(portStatusTable.checkTime, new Date(to)) : undefined,
        ),
      )
      .orderBy(desc(portStatusTable.checkTime));

    const ports = portGroup.items
      .filter((item) => (port ? item.port === parseInt(port) : true))
      .map((item) => {
        const devicesInGroup = deviceGroup.devices.map((dg) => dg.device);

        const devices = devicesInGroup
          .filter((dev) => (deviceId ? dev.id === parseInt(deviceId) : true))
          .map((dev) => {
            const history = results
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
