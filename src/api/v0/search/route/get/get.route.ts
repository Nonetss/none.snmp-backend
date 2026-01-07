import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceRouteResponseSchema } from './get.schema';

export const getDeviceRouteRoute = createRoute({
  method: 'get',
  path: '/{id}/route',
  summary: 'Get Routing table information',
  tags: ['Device Routing'],
  description:
    'Returns the routing table for the specified device from IP-FORWARD-MIB.',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getDeviceRouteResponseSchema,
        },
      },
      description: 'Routing table entries',
    },
    404: {
      description: 'Device not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
