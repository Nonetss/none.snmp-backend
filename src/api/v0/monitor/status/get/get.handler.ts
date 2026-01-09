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
            devices: true,
          },
        },
      },
    });

    interface PortStatus {
      deviceId: number;
      deviceDataPort: {
        port: number;
        statusData: {
          status: boolean;
          checkTime: Date;
          responseTime: number | null;
        }[]; // Ahora es un array
      }[];
    }

    const conditions = [eq(portStatusTable.ruleId, ruleId)];

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
    const groupedData: PortStatus[] = Array.from(deviceMap.entries()).map(
      ([deviceId, portMap]) => ({
        deviceId,
        deviceDataPort: Array.from(portMap.entries()).map(
          ([port, statusData]) => ({
            port,
            statusData, // Este ya es el array de estados agrupados
          }),
        ),
      }),
    );

    return c.json({ rule, groupedData }, 200);
  } catch (error) {
    console.error('[Get Rule Status] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
