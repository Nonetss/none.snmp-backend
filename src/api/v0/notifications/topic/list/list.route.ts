import { createRoute, z } from '@hono/zod-openapi';
import { NtfyTopicSchema } from '../topic.schema';

export const listNtfyTopicRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List ntfy topics',
  tags: ['Notifications Topic'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(NtfyTopicSchema),
        },
      },
      description: 'List of topics',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
