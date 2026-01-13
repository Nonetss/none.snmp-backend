import { createRoute, z } from '@hono/zod-openapi';
import {
  updateDnsServerSchema,
  dnsServerResponseSchema,
} from '../dnsServer.schema';

export const patchDnsServerRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update a DNS server',
  tags: ['Toolbox DNS Servers'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateDnsServerSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: dnsServerResponseSchema,
        },
      },
      description: 'DNS server updated',
    },
    404: {
      description: 'DNS server not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
