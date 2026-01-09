import { createRoute } from '@hono/zod-openapi';
import {
  NotificationActionFullSchema,
  NotificationActionIdParamSchema,
} from '../action.schema';

export const getNotificationActionRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get notification action by ID',
  tags: ['Notifications Action'],
  request: {
    params: NotificationActionIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: NotificationActionFullSchema,
        },
      },
      description: 'The notification action',
    },
    404: {
      description: 'Action not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
