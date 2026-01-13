import { createRoute } from '@hono/zod-openapi';
import { komodoAuthResponseSchema } from '../auth.schema';

export const getKomodoAuthRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get Komodo credentials',
  tags: ['Komodo Auth'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: komodoAuthResponseSchema.nullable(),
        },
      },
      description: 'Komodo credentials',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
