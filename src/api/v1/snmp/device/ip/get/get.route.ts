import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceIpResponseSchema } from './get.schema';

export const getDeviceIpRoute = createRoute({
  method: 'get',
  path: '/{id}/ip',
  summary: 'Get device IP and ARP tables',
  tags: ['Device IP'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: getDeviceIpResponseSchema } },
      description: 'IP and ARP information',
    },
    404: { description: 'Device not found' },
    500: { description: 'Internal server error' },
  },
});
