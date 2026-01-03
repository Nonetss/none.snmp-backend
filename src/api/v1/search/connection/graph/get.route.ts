import { createRoute } from '@hono/zod-openapi';
import { connectionGraphResponseSchema } from './get.schema';

export const getConnectionGraphRoute = createRoute({
  method: 'get',
  path: '/graph',
  summary: 'Get network connection graph',
  tags: ['Search', 'Search Connection'],
  description:
    'Returns a graph structure of devices and their connections based on LLDP and CDP neighbor information.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: connectionGraphResponseSchema,
        },
      },
      description: 'The connection graph',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
