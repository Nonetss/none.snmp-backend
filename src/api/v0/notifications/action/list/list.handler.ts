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
        ntfyAction: {
          with: {
            tags: true,
            topic: true,
          },
        },
      },
    });

    // Mapear tags para que sean un array de strings en la respuesta
    const formattedActions = actions.map((action) => ({
      ...action,
      ntfyAction: action.ntfyAction
        ? {
            ...action.ntfyAction,
            tags: action.ntfyAction.tags.map((t: any) => t.tag),
          }
        : null,
    }));

    return c.json(formattedActions, 200);
  } catch (error) {
    console.error('Error listing notification actions:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
