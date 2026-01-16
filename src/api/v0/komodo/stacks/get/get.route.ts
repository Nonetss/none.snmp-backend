import { createRoute, z } from '@hono/zod-openapi';
import { stackResponse } from '@/api/v0/komodo/stacks/get/get.schema';

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
          schema: stackResponse,
        },
      },
      description: 'Komodo stack',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
