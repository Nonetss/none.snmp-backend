import { createRoute } from '@hono/zod-openapi';
import { RescanSchema, RescanResponseSchema } from './rescan.schema';

export const postRescanRoute = createRoute({
  method: 'post',
  path: '/{id}',
  summary: 'Rescan a subnet by ID',
  description:
    'Fetches the CIDR of a subnet by its ID and performs a full SNMP scan.',
  request: {
    params: RescanSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RescanResponseSchema,
        },
      },
      description: 'Scan results',
    },
    404: {
      description: 'Subnet not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
  tags: ['SNMP Scan'],
});
