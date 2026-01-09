import { createRoute, z } from '@hono/zod-openapi';
import { NotificationActionIdParamSchema } from '../action.schema';

export const deleteNotificationActionRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete notification action',
  tags: ['Notifications Action'],
  request: {
    params: NotificationActionIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Action deleted',
    },
    404: {
      description: 'Action not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
