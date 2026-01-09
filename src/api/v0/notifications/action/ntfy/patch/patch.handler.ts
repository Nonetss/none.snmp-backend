import { db } from '@/core/config';
import { ntfyActionTable, ntfyActionTagTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchNtfyActionRoute } from './patch.route';

export const patchNtfyActionHandler: RouteHandler<
  typeof patchNtfyActionRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const { tags, ...values } = c.req.valid('json');

  try {
    const [updatedAction] = await db
      .update(ntfyActionTable)
      .set(values)
      .where(eq(ntfyActionTable.id, id))
      .returning();

    if (!updatedAction) {
      return c.json({ message: 'Ntfy configuration not found' }, 404);
    }

    if (tags !== undefined) {
      // Borrar tags anteriores y poner los nuevos
      await db
        .delete(ntfyActionTagTable)
        .where(eq(ntfyActionTagTable.ntfyActionId, id));

      if (tags.length > 0) {
        await db.insert(ntfyActionTagTable).values(
          tags.map((tag) => ({
            ntfyActionId: id,
            tag,
          })),
        );
      }
    }

    return c.json(updatedAction, 200);
  } catch (error) {
    console.error('Error updating ntfy action:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
