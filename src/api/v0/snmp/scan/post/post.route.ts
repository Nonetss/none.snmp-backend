import { createRoute } from '@hono/zod-openapi';
import { PostScanSchema, PostScanResponseSchema } from './post.schema';

export const postScanRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Scan network for SNMP devices',
  description:
    'Scans a CIDR range, pings hosts, and attempts SNMP connection with all stored credentials. Updates or creates device records accordingly.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostScanSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostScanResponseSchema,
        },
      },
      description: 'Scan results',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
  tags: ['SNMP Scan'],
});
