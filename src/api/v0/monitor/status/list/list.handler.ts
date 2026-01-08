import { db } from '@/core/config';
import { monitorRuleTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listPortStatusRoute } from './list.route';

export const listPortStatusHandler: RouteHandler<
  typeof listPortStatusRoute
> = async (c) => {
  try {
    // 1. Obtener todas las reglas con los últimos 100 resultados cada una
    const rulesData = await db.query.monitorRuleTable.findMany({
      with: {
        portGroup: {
          with: { items: true },
        },
        deviceGroup: {
          with: { devices: { with: { device: true } } },
        },
        results: {
          limit: 100,
          orderBy: (fields, { desc }) => [desc(fields.checkTime)],
          with: { device: true },
        },
      },
    });

    // 2. Agrupar los datos para la respuesta
    const response = rulesData.map((rule) => {
      const ports = rule.portGroup.items.map((item) => {
        const devicesInGroup = rule.deviceGroup.devices.map((dg) => dg.device);

        const devices = devicesInGroup.map((dev) => {
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

      return {
        id: rule.id,
        name: rule.name,
        enabled: rule.enabled,
        cronExpression: rule.cronExpression,
        lastRun: rule.lastRun?.toISOString() || null,
        status: rule.status,
        ports,
      };
    });

    return c.json(response, 200);
  } catch (error) {
    console.error('[List Port Status] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
