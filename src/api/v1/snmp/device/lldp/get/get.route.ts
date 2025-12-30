import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceLldpResponseSchema } from './get.schema';

export const getDeviceLldpRoute = createRoute({
  method: 'get',
  path: '/{id}/lldp',
  summary: 'Get LLDP neighbor information',
  tags: ['Device LLDP'],
  description:
    'Returns the list of Link Layer Discovery Protocol (LLDP) neighbors for the specified device.',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getDeviceLldpResponseSchema,
        },
      },
      description: 'List of LLDP neighbors',
    },
    404: {
      description: 'Device not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
