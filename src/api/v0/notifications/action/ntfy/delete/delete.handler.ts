import { db } from '@/core/config';
import { ntfyActionTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteNtfyActionRoute } from './delete.route';

export const deleteNtfyActionHandler: RouteHandler<
  typeof deleteNtfyActionRoute
> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [deletedAction] = await db
      .delete(ntfyActionTable)
      .where(eq(ntfyActionTable.id, id))
      .returning();

    if (!deletedAction) {
      return c.json({ message: 'Ntfy configuration not found' }, 404);
    }

    return c.json({ message: 'Ntfy configuration deleted' }, 200);
  } catch (error) {
    console.error('Error deleting ntfy action:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
