import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceBridgeResponseSchema } from './get.schema';

export const getDeviceBridgeRoute = createRoute({
  method: 'get',
  path: '/{id}/bridge',
  summary: 'Get bridge information (MAC table and ports)',
  tags: ['Device Bridge'],
  description:
    'Returns the bridge base info, port mappings, and Forwarding Database (MAC table) for the specified device.',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getDeviceBridgeResponseSchema,
        },
      },
      description: 'Bridge information',
    },
    404: {
      description: 'Device not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
