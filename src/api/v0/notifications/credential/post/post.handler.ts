import { db } from '@/core/config';
import { ntfyCredentialTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postNtfyCredentialRoute } from '@/api/v0/notifications/credential/post/post.route';

export const postNtfyCredentialHandler: RouteHandler<
  typeof postNtfyCredentialRoute
> = async (c) => {
  const values = c.req.valid('json');

  try {
    const [newCredential] = await db
      .insert(ntfyCredentialTable)
      .values(values)
      .returning();
    return c.json(newCredential, 201);
  } catch (error) {
    console.error('Error creating ntfy credential:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
