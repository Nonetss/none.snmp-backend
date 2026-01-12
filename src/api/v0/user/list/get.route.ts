import { createRoute } from '@hono/zod-openapi';
import { getUserListResponseSchema } from './get.schema';

export const getUserListRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Users'],
  summary: 'List all users',
  description: 'Retrieve a list of all users registered in the system.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getUserListResponseSchema,
        },
      },
      description: 'List of all users',
    },
  },
});
