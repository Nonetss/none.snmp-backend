import { createRoute, z } from '@hono/zod-openapi';
import { dnsServerResponseSchema } from '../dnsServer.schema';

export const getDnsServerRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get a DNS server by ID',
  tags: ['Toolbox DNS Servers'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: dnsServerResponseSchema,
        },
      },
      description: 'DNS server details',
    },
    404: {
      description: 'DNS server not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
