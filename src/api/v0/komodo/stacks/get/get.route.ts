import { createRoute, z } from '@hono/zod-openapi';
import { stackResponseSchema } from './get.schema';

export const getKomodoStackRoute = createRoute({
  method: 'get',
  path: '/{stackId}',
  summary: 'Get a Komodo stack',
  tags: ['Komodo'],
  request: {
    params: z.object({
      stackId: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: stackResponseSchema,
        },
      },
      description: 'Komodo stack',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
