import { createRoute } from '@hono/zod-openapi';
import { dnsServerListResponseSchema } from '../dnsServer.schema';

export const listDnsServerRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all DNS servers',
  tags: ['Toolbox DNS Servers'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: dnsServerListResponseSchema,
        },
      },
      description: 'List of DNS servers',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
