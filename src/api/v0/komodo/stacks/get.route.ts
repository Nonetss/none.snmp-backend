import { createRoute } from '@hono/zod-openapi';
import { stackListResponseSchema } from './get.schema';

export const listKomodoStacksRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all Komodo stacks',
  tags: ['Komodo Stacks'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: stackListResponseSchema,
        },
      },
      description: 'List of all Komodo stacks',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
