import { db } from '@/core/config';
import { deviceTable, subnetTable, locationTable } from '@/db';
import { eq, inArray, or, and, isNotNull } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { assignLocationRoute } from './assign.route';

export const assignLocationHandler: RouteHandler<
  typeof assignLocationRoute
> = async (c) => {
  try {
    const { locationId, subnetIds, deviceIds, force } = c.req.valid('json');

    const hasSubnets = subnetIds && subnetIds.length > 0;
    const hasDevices = deviceIds && deviceIds.length > 0;

    if (!hasSubnets && !hasDevices) {
      return c.json(
        { message: 'Provide either subnetIds or deviceIds' },
        400,
      ) as any;
    }

    // Si locationId es -1, queremos QUITAR la localización (set null)
    const isUnassign = locationId === -1;
    const finalLocationId = isUnassign ? null : locationId;

    if (!isUnassign) {
      // Validar que la location existe
      const [location] = await db
        .select()
        .from(locationTable)
        .where(eq(locationTable.id, locationId))
        .limit(1);

      if (!location) {
        return c.json({ message: 'Location not found' }, 404) as any;
      }
    }

    const conditions = [];

    if (hasSubnets) {
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

    const targetFilter = or(...conditions);

    // Si force es false, verificar si hay dispositivos ya asignados a OTRA localización
    if (!force) {
      const alreadyAssigned = await db
        .select({ id: deviceTable.id, ipv4: deviceTable.ipv4 })
        .from(deviceTable)
        .where(and(targetFilter, isNotNull(deviceTable.locationId)))
        .limit(10);

      if (alreadyAssigned.length > 0) {
        return c.json(
          {
            message:
              'Some devices are already assigned to a location. Use force: true to overwrite.',
            conflictingDevices: alreadyAssigned,
          },
          400,
        ) as any;
      }
    }

    // Actualizar dispositivos que cumplan cualquiera de las condiciones (OR)
    const result = await db
      .update(deviceTable)
      .set({ locationId: finalLocationId })
      .where(targetFilter)
      .returning();

    return c.json(
      {
        message: isUnassign
          ? `${result.length} devices unassigned from locations`
          : `${result.length} devices assigned to location`,
        count: result.length,
      },
      200,
    );
  } catch (error) {
    console.error('[Assign Location] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
