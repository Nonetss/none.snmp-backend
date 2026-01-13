import { createRoute, z } from '@hono/zod-openapi';
import { stackListResponseSchema } from '../stacks.schema';

export const getKomodoStacksByServerRoute = createRoute({
  method: 'get',
  path: '/{serverId}',
  summary: 'List Komodo stacks by server ID',
  tags: ['Komodo Stacks'],
  request: {
    params: z.object({
      serverId: z.string().openapi({ example: 'server-id-1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: stackListResponseSchema,
        },
      },
      description: 'List of Komodo stacks for the specified server',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
