import { createRoute, z } from '@hono/zod-openapi';
import {
  getSwitchConnectionsResponseSchema,
  getSwitchConnectionsQuerySchema,
  networkEdgeSchema,
} from './get.schema';

export const getSwitchConnectionsRoute = createRoute({
  method: 'get',
  path: '/graph/switch',
  summary: 'Get switch-to-switch connections',
  tags: ['Search Connection', 'Topology'],
  description:
    'Analyzes LLDP neighbors to return a list of physical connections between switches and other network infrastructure.',
  request: {
    query: getSwitchConnectionsQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.union([
            getSwitchConnectionsResponseSchema,
            z.array(networkEdgeSchema),
            z.object({ graph: z.string() }),
          ]),
        },
      },
      description: 'List of switch connections',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
