import { createRoute } from '@hono/zod-openapi';
import { listKomodoServersResponseSchema } from './get.schema';

export const listKomodoServersRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List Komodo servers',
  tags: ['Komodo'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: listKomodoServersResponseSchema,
        },
      },
      description: 'List of Komodo servers',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
