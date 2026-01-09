import { db } from '@/core/config';
import { deviceTable, locationTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchDeviceLocationRoute } from './location.route';

export const patchDeviceLocationHandler: RouteHandler<
  typeof patchDeviceLocationRoute
> = async (c) => {
  try {
    const { deviceId, locationId } = c.req.valid('json');

    // 1. Verificar que el dispositivo existe
    const [device] = await db
      .select()
      .from(deviceTable)
      .where(eq(deviceTable.id, deviceId))
      .limit(1);

    if (!device) {
      return c.json({ message: 'Device not found' }, 404) as any;
    }

    // 2. Si se proporciona locationId, verificar que la localización existe
    if (locationId !== null) {
      const [location] = await db
        .select()
        .from(locationTable)
        .where(eq(locationTable.id, locationId))
        .limit(1);

      if (!location) {
        return c.json({ message: 'Location not found' }, 404) as any;
      }
    }

    // 3. Actualizar la localización del dispositivo
    await db
      .update(deviceTable)
      .set({ locationId })
      .where(eq(deviceTable.id, deviceId));

    return c.json(
      {
        message:
          locationId === null
            ? 'Location removed from device'
            : 'Location assigned to device',
        deviceId,
        locationId,
      },
      200,
    );
  } catch (error) {
    console.error('[Device Location Update] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
