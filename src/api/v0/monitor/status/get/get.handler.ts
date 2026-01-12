import { db } from '@/core/config';
import { monitorRuleTable, portStatusTable } from '@/db';
import { eq, and, gte, lte, desc, inArray } from 'drizzle-orm';
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
    const rule = await db.query.monitorRuleTable.findFirst({
      where: {
        id: {
          eq: ruleId,
        },
      },
      with: {
        portGroup: {
          with: {
            items: true,
          },
        },
        deviceGroup: {
          with: {
            devices: {
              with: {
                device: {
                  with: {
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!rule) {
      return c.json({ message: 'Rule not found' }, 404);
    }

    const allowedPorts = rule.portGroup?.items.map((i) => i.port) || [];

    const conditions = [eq(portStatusTable.ruleId, ruleId)];

    if (allowedPorts.length > 0) {
      conditions.push(inArray(portStatusTable.port, allowedPorts));
    } else {
      return c.json({ rule, groupedData: [] }, 200);
    }

    if (deviceId) {
      const parsedDeviceId = parseInt(deviceId);
      if (!isNaN(parsedDeviceId)) {
        conditions.push(eq(portStatusTable.deviceId, parsedDeviceId));
      }
    }

    if (port) {
      const parsedPort = parseInt(port);
      if (!isNaN(parsedPort)) {
        conditions.push(eq(portStatusTable.port, parsedPort));
      }
    }

    if (from) {
      conditions.push(gte(portStatusTable.checkTime, new Date(from)));
    }

    if (to) {
      conditions.push(lte(portStatusTable.checkTime, new Date(to)));
    }

    const rawPortData = await db
      .select({
        deviceId: portStatusTable.deviceId,
        port: portStatusTable.port,
        status: portStatusTable.status,
        checkTime: portStatusTable.checkTime,
        responseTime: portStatusTable.responseTime,
      })
      .from(portStatusTable)
      .where(and(...conditions))
      .orderBy(desc(portStatusTable.checkTime));

    // 1. Usamos un Map para agrupar por DeviceId y dentro por Port
    const deviceMap = new Map<
      number,
      Map<
        number,
        { status: boolean; checkTime: Date; responseTime: number | null }[]
      >
    >();

    for (const curr of rawPortData) {
      // Inicializar el Map del dispositivo si no existe
      if (!deviceMap.has(curr.deviceId)) {
        deviceMap.set(curr.deviceId, new Map());
      }

      const portMap = deviceMap.get(curr.deviceId)!;

      // Inicializar el array del puerto si no existe
      if (!portMap.has(curr.port)) {
        portMap.set(curr.port, []);
      }

      // Empujar el estado al histórico de ese puerto
      portMap.get(curr.port)!.push({
        status: curr.status,
        checkTime: curr.checkTime,
        responseTime: curr.responseTime,
      });
    }

    // 2. Transformar los Maps anidados a la estructura de arrays final
    // Limitamos a un máximo de 300 puntos por dispositivo/puerto para no sobrecargar el frontend
    const MAX_POINTS = 300;

    const groupedData = Array.from(deviceMap.entries()).map(
      ([deviceId, portMap]) => {
        return {
          deviceId,
          deviceDataPort: Array.from(portMap.entries()).map(
            ([port, statusData]) => {
              let sampledData = statusData;

              // Si hay más de MAX_POINTS, realizamos un muestreo (downsampling) mediante promedios
              if (statusData.length > MAX_POINTS) {
                const totalPoints = statusData.length;
                sampledData = [];
                for (let i = 0; i < MAX_POINTS; i++) {
                  const start = Math.floor((i * totalPoints) / MAX_POINTS);
                  const end = Math.floor(((i + 1) * totalPoints) / MAX_POINTS);

                  if (start >= end) continue;

                  const chunk = statusData.slice(start, end);

                  let sumResponseTime = 0;
                  let countResponseTime = 0;
                  let trueStatusCount = 0;
                  let sumCheckTime = 0;

                  for (const item of chunk) {
                    if (item.responseTime !== null) {
                      sumResponseTime += item.responseTime;
                      countResponseTime++;
                    }
                    if (item.status) {
                      trueStatusCount++;
                    }
                    sumCheckTime += item.checkTime.getTime();
                  }

                  sampledData.push({
                    status: trueStatusCount > chunk.length / 2,
                    checkTime: new Date(sumCheckTime / chunk.length),
                    responseTime:
                      countResponseTime > 0
                        ? Math.round(sumResponseTime / countResponseTime)
                        : null,
                  });
                }
              }

              return {
                port,
                statusData: sampledData,
              };
            },
          ),
        };
      },
    );

    return c.json({ rule, groupedData }, 200);
  } catch (error) {
    console.error('[Get Rule Status] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
