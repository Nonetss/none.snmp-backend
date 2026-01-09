import { db } from '@/core/config';
import { ntfyActionTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getNtfyActionRoute } from './get.route';

export const getNtfyActionHandler: RouteHandler<
  typeof getNtfyActionRoute
> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [action] = await db
      .select()
      .from(ntfyActionTable)
      .where(eq(ntfyActionTable.id, id));

    if (!action) {
      return c.json({ message: 'Ntfy configuration not found' }, 404);
    }

    return c.json(action, 200);
  } catch (error) {
    console.error('Error getting ntfy action:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
