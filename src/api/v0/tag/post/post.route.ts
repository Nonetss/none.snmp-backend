import { createRoute } from '@hono/zod-openapi';
import { CreateTagSchema, TagSchema } from '../tag.schema';

export const postTagRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create a new tag',
  tags: ['Tag'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateTagSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: TagSchema,
        },
      },
      description: 'Tag created successfully',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
