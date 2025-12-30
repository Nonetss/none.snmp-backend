import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceCdpResponseSchema } from './get.schema';

export const getDeviceCdpRoute = createRoute({
  method: 'get',
  path: '/{id}/cdp',
  summary: 'Get CDP neighbor information',
  tags: ['Device CDP'],
  description:
    'Returns the list of Cisco Discovery Protocol (CDP) neighbors for the specified device.',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getDeviceCdpResponseSchema,
        },
      },
      description: 'List of CDP neighbors',
    },
    404: {
      description: 'Device not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
