import { createRoute, z } from '@hono/zod-openapi';
import { NtfyTopicIdParamSchema } from '@/api/v0/notifications/topic/topic.schema';

export const deleteNtfyTopicRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete ntfy topic',
  tags: ['Notifications Topic'],
  request: {
    params: NtfyTopicIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Topic deleted',
    },
    404: {
      description: 'Topic not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
