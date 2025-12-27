import { createRoute } from '@hono/zod-openapi';
import { PostAuthSchema, PostAuthResponseSchema } from './post.schema';

export const postAuthRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create SNMP Authentication',
  description: 'Create a new SNMP authentication',
  tags: ['SNMP Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostAuthSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostAuthResponseSchema,
        },
      },
      description: 'Authentication created successfully',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
