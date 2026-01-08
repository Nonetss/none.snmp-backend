import { db } from '@/core/config';
import { locationTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getLocationRoute } from './get.route';

export const getLocationHandler: RouteHandler<typeof getLocationRoute> = async (
  c,
) => {
  try {
    const { id } = c.req.valid('param');
    const location = await db.query.locationTable.findFirst({
      where: eq(locationTable.id, parseInt(id, 10)),
    });

    if (!location) {
      return c.json({ message: 'Location not found' }, 404) as any;
    }

    return c.json(location, 200);
  } catch (error) {
    console.error('[Get Location] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
