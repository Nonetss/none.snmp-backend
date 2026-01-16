import { createRoute, z } from '@hono/zod-openapi';
import { getKomodoServerResponseSchema } from '@/api/v0/komodo/server/get/get.schema';

export const getKomodoServerRoute = createRoute({
  method: 'get',
  path: '/{serverId}',
  summary: 'Get full details of a Komodo server',
  tags: ['Komodo'],
  request: {
    params: z.object({
      serverId: z.string().openapi({ example: 'server-id-1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getKomodoServerResponseSchema,
        },
      },
      description: 'Full server details',
    },
    404: {
      description: 'Server not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
