import { createRoute } from '@hono/zod-openapi';
import { PortScanSchema, PortScanResponseSchema } from '../tcp.schema';

export const postPortScanRoute = createRoute({
  method: 'post',
  path: '/scan',
  summary: 'Perform a multi-port TCP scan (nmap style)',
  tags: ['Monitor', 'TCP'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: PortScanSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PortScanResponseSchema,
        },
      },
      description: 'Scan results',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
