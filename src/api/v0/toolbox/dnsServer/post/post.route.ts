import { createRoute } from '@hono/zod-openapi';
import {
  createDnsServerSchema,
  dnsServerResponseSchema,
} from '../dnsServer.schema';

export const postDnsServerRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create a new DNS server',
  tags: ['Toolbox DNS Servers'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createDnsServerSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: dnsServerResponseSchema,
        },
      },
      description: 'DNS server created',
    },
    400: {
      description: 'Invalid input',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
