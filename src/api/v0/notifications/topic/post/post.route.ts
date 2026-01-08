import { createRoute } from '@hono/zod-openapi';
import {
  NtfyTopicSchema,
  CreateNtfyTopicSchema,
} from '@/api/v0/notifications/topic/topic.schema';

export const postNtfyTopicRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create ntfy topic',
  tags: ['Notifications Topic'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateNtfyTopicSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: NtfyTopicSchema,
        },
      },
      description: 'Topic created',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
