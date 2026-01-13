import { createRoute, z } from '@hono/zod-openapi';
import { containerResponseSchema } from './get.schema';

export const getKomodoContainerRoute = createRoute({
  method: 'get',
  path: '/{serverId}',
  summary: 'Get a Komodo container',
  tags: ['Komodo'],
  request: {
    params: z.object({
      serverId: z.string(),
    }),
    query: z.object({
      containerId: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: containerResponseSchema,
        },
      },
      description: 'Komodo container',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
