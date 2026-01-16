import { createRoute } from '@hono/zod-openapi';
import { stackListResponse } from '@/api/v0/komodo/stacks/list/get.schema';

export const listKomodoStacksRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all Komodo stacks',
  tags: ['Komodo'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: stackListResponse,
        },
      },
      description: 'List of all Komodo stacks',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
