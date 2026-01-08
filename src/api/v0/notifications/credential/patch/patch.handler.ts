import { db } from '@/core/config';
import { ntfyCredentialTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { patchNtfyCredentialRoute } from '@/api/v0/notifications/credential/patch/patch.route';

export const patchNtfyCredentialHandler: RouteHandler<
  typeof patchNtfyCredentialRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const updates = c.req.valid('json');

  try {
    const [updated] = await db
      .update(ntfyCredentialTable)
      .set(updates)
      .where(eq(ntfyCredentialTable.id, id))
      .returning();
    if (!updated) {
      return c.json({ message: 'Credential not found' }, 404) as any;
    }
    return c.json(updated, 200);
  } catch (error) {
    console.error('Error updating ntfy credential:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
