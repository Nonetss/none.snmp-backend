import { db } from '@/core/config';
import { ntfyCredentialTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listNtfyCredentialRoute } from '@/api/v0/notifications/credential/list/list.route';

export const listNtfyCredentialHandler: RouteHandler<
  typeof listNtfyCredentialRoute
> = async (c) => {
  try {
    const credentials = await db.select().from(ntfyCredentialTable);
    return c.json(credentials, 200);
  } catch (error) {
    console.error('Error listing ntfy credentials:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
