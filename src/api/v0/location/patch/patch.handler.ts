import { db } from '@/core/config';
import { locationTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchLocationRoute } from './patch.route';

export const patchLocationHandler: RouteHandler<
  typeof patchLocationRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');
    const data = c.req.valid('json');

    const [updatedLocation] = await db
      .update(locationTable)
      .set(data)
      .where(eq(locationTable.id, parseInt(id, 10)))
      .returning();

    if (!updatedLocation) {
      return c.json({ message: 'Location not found' }, 404) as any;
    }

    return c.json(updatedLocation, 200);
  } catch (error) {
    console.error('[Patch Location] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
