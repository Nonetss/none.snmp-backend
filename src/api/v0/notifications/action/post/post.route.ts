import { createRoute } from '@hono/zod-openapi';
import {
  NotificationActionSchema,
  CreateNotificationActionSchema,
} from '@/api/v0/notifications/action/action.schema';

export const postNotificationActionRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create notification action',
  tags: ['Notifications Action'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateNotificationActionSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: NotificationActionSchema,
        },
      },
      description: 'Action created',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
