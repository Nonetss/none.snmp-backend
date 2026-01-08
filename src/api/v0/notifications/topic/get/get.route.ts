import { createRoute } from '@hono/zod-openapi';
import {
  NtfyTopicSchema,
  NtfyTopicIdParamSchema,
} from '@/api/v0/notifications/topic/topic.schema';

export const getNtfyTopicRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get ntfy topic by ID',
  tags: ['Notifications Topic'],
  request: {
    params: NtfyTopicIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: NtfyTopicSchema,
        },
      },
      description: 'Topic found',
    },
    404: {
      description: 'Topic not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
