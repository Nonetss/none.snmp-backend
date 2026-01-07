import { db } from '@/core/config';
import { deviceTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteDeviceRoute } from './delete.route';

export const deleteDeviceHandler: RouteHandler<
  typeof deleteDeviceRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  try {
    const result = await db
      .delete(deviceTable)
      .where(eq(deviceTable.id, parseInt(id)))
      .returning();
    if (result.length === 0)
      return c.json({ message: 'Device not found' }, 404) as any;
    return c.json({ message: 'Device deleted successfully' }, 200);
  } catch (error) {
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
