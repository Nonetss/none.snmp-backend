import { db } from '@/core/config';
import { deviceTable, subnetTable, locationTable } from '@/db';
import { eq, inArray, or } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { assignLocationRoute } from './assign.route';

export const assignLocationHandler: RouteHandler<
  typeof assignLocationRoute
> = async (c) => {
  try {
    const { locationId, subnetIds, deviceIds } = c.req.valid('json');

    const hasSubnets = subnetIds && subnetIds.length > 0;
    const hasDevices = deviceIds && deviceIds.length > 0;

    if (!hasSubnets && !hasDevices) {
      return c.json(
        { message: 'Provide either subnetIds or deviceIds' },
        400,
      ) as any;
    }

    // Validar que la location existe
    const location = await db.query.locationTable.findFirst({
      where: eq(locationTable.id, locationId),
    });
    if (!location) {
      return c.json({ message: 'Location not found' }, 404) as any;
    }

    const conditions = [];

    if (hasSubnets) {
      // Validar que las subnets existen (opcional, pero recomendado para integridad)
      const subnets = await db
        .select()
        .from(subnetTable)
        .where(inArray(subnetTable.id, subnetIds));

      if (subnets.length !== subnetIds.length) {
        return c.json(
          { message: 'One or more subnetIds not found' },
          404,
        ) as any;
      }
      conditions.push(inArray(deviceTable.subnetId, subnetIds));
    }

    if (hasDevices) {
      conditions.push(inArray(deviceTable.id, deviceIds));
    }

    // Actualizar dispositivos que cumplan cualquiera de las condiciones (OR)
    const result = await db
      .update(deviceTable)
      .set({ locationId })
      .where(or(...conditions))
      .returning();

    return c.json(
      {
        message: `${result.length} devices assigned to location`,
        count: result.length,
      },
      200,
    );
  } catch (error) {
    console.error('[Assign Location] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
