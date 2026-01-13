import { createRoute } from '@hono/zod-openapi';
import { npmAuthResponseSchema } from '../auth.schema';

export const getNpmAuthRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get NPM credentials',
  tags: ['NPM Auth'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: npmAuthResponseSchema.nullable(),
        },
      },
      description: 'NPM credentials',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
