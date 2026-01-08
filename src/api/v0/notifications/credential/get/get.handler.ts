import { db } from '@/core/config';
import { ntfyCredentialTable } from '@/db';
import { eq } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getNtfyCredentialRoute } from '@/api/v0/notifications/credential/get/get.route';

export const getNtfyCredentialHandler: RouteHandler<
  typeof getNtfyCredentialRoute
> = async (c) => {
  const { id } = c.req.valid('param');

  try {
    const [credential] = await db
      .select()
      .from(ntfyCredentialTable)
      .where(eq(ntfyCredentialTable.id, id));
    if (!credential) {
      return c.json({ message: 'Credential not found' }, 404) as any;
    }
    return c.json(credential, 200);
  } catch (error) {
    console.error('Error getting ntfy credential:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
