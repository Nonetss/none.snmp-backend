import { createRoute } from '@hono/zod-openapi';
import {
  NotificationActionSchema,
  UpdateNotificationActionSchema,
  NotificationActionIdParamSchema,
} from '../action.schema';

export const patchNotificationActionRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update notification action',
  tags: ['Notifications Action'],
  request: {
    params: NotificationActionIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateNotificationActionSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: NotificationActionSchema,
        },
      },
      description: 'Action updated',
    },
    404: {
      description: 'Action not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
