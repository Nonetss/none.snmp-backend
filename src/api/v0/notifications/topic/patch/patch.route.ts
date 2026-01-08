import { createRoute } from '@hono/zod-openapi';
import {
  NtfyTopicSchema,
  NtfyTopicIdParamSchema,
  UpdateNtfyTopicSchema,
} from '@/api/v0/notifications/topic/topic.schema';

export const patchNtfyTopicRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update ntfy topic',
  tags: ['Notifications Topic'],
  request: {
    params: NtfyTopicIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateNtfyTopicSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: NtfyTopicSchema,
        },
      },
      description: 'Topic updated',
    },
    404: {
      description: 'Topic not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
