import { createRoute } from '@hono/zod-openapi';
import { getKomodoServersResponseSchema } from './get.schema';

export const getKomodoServersRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List Komodo servers',
  tags: ['Komodo'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getKomodoServersResponseSchema,
        },
      },
      description: 'List of Komodo servers',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
