import { createRoute } from '@hono/zod-openapi';
import {
  NtfyActionSchema,
  CreateNtfyActionSchema,
} from '@/api/v0/notifications/action/action.schema';

export const postNtfyActionRoute = createRoute({
  method: 'post',
  path: '/ntfy',
  summary: 'Configure ntfy for an action',
  tags: ['Notifications Action'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateNtfyActionSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: NtfyActionSchema,
        },
      },
      description: 'Ntfy action configured',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
