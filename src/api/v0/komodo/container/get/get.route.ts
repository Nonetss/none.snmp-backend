import { createRoute, z } from '@hono/zod-openapi';
import { containerListResponseSchema } from '../container.schema';

export const getKomodoContainersByServerRoute = createRoute({
  method: 'get',
  path: '/{serverId}',
  summary: 'List Komodo containers by server ID',
  tags: ['Komodo Containers'],
  request: {
    params: z.object({
      serverId: z.string().openapi({ example: 'server-id-1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: containerListResponseSchema,
        },
      },
      description: 'List of Komodo containers for the specified server',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
