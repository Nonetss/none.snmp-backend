import { db } from '@/core/config';
import { locationTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteLocationRoute } from './delete.route';

export const deleteLocationHandler: RouteHandler<
  typeof deleteLocationRoute
> = async (c) => {
  try {
    const { id } = c.req.valid('param');

    const [deletedLocation] = await db
      .delete(locationTable)
      .where(eq(locationTable.id, parseInt(id, 10)))
      .returning();

    if (!deletedLocation) {
      return c.json({ message: 'Location not found' }, 404) as any;
    }

    return c.json({ message: 'Location deleted' }, 200);
  } catch (error) {
    console.error('[Delete Location] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
