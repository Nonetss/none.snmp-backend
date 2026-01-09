import { createRoute, z } from '@hono/zod-openapi';
import { NotificationActionFullSchema } from '../action.schema';

export const listNotificationActionsRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all notification actions',
  tags: ['Notifications Action'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(NotificationActionFullSchema),
        },
      },
      description: 'List of actions',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
