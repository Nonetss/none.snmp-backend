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
          with: {
            devices: true,
          },
        },
        results: {
          limit: 100,
          orderBy: (fields, { desc }) => [desc(fields.checkTime)],
        },
      },
    });

    // 2. Agrupar los datos para la respuesta (usando la lógica eficiente del Get)
    const response = rulesData.map((rule) => {
      // Usamos un Map para agrupar por DeviceId y dentro por Port
      const deviceMap = new Map<
        number,
        Map<
          number,
          { status: boolean; checkTime: Date; responseTime: number | null }[]
        >
      >();

      for (const curr of rule.results) {
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

      // Transformar los Maps anidados a la estructura de arrays final
      const groupedData = Array.from(deviceMap.entries()).map(
        ([deviceId, portMap]) => ({
          deviceId,
          deviceDataPort: Array.from(portMap.entries()).map(
            ([port, statusData]) => ({
              port,
              statusData,
            }),
          ),
        }),
      );

      // Separar los resultados de la regla para coincidir con el esquema RuleDetails
      const { results, ...ruleDetails } = rule;

      return {
        rule: ruleDetails,
        groupedData,
      };
    });

    return c.json(response, 200);
  } catch (error) {
    console.error('[List Port Status] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
