import { db } from '@/core/config';
import { ntfyCredentialTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { deleteNtfyCredentialRoute } from '@/api/v0/notifications/credential/delete/delete.route';

export const deleteNtfyCredentialHandler: RouteHandler<
  typeof deleteNtfyCredentialRoute
> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [deleted] = await db
      .delete(ntfyCredentialTable)
      .where(eq(ntfyCredentialTable.id, id))
      .returning();
    if (!deleted) {
      return c.json({ message: 'Credential not found' }, 404) as any;
    }
    return c.json({ message: 'Credential deleted' }, 200);
  } catch (error) {
    console.error('Error deleting ntfy credential:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
