import { createRoute, z } from '@hono/zod-openapi';
import { containerResponse } from '@/api/v0/komodo/container/get/get.schema';

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
          schema: containerResponse,
        },
      },
      description: 'Komodo container',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
