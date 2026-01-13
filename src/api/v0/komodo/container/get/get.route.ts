import { createRoute, z } from '@hono/zod-openapi';
import { getKomodoContainersResponseSchema } from './get.schema';

export const getKomodoContainersRoute = createRoute({
  method: 'get',
  path: '/{serverId}',
  summary: 'List Komodo containers',
  tags: ['Komodo'],
  request: {
    params: z.object({
      serverId: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getKomodoContainersResponseSchema,
        },
      },
      description: 'List of Komodo containers',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
