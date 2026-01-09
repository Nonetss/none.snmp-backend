import { db } from '@/core/config';
import { notificationActionTable } from '@/db';
import type { RouteHandler } from '@hono/zod-openapi';
import type { listNotificationActionsRoute } from './list.route';

export const listNotificationActionsHandler: RouteHandler<
  typeof listNotificationActionsRoute
> = async (c) => {
  try {
    const actions = await db.query.notificationActionTable.findMany({
      with: {
        ntfyAction: true,
      },
    });
    return c.json(actions, 200);
  } catch (error) {
    console.error('Error listing notification actions:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
