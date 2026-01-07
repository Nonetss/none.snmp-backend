import { createRoute } from '@hono/zod-openapi';
import { SubnetSchema } from '../subnet.schema';
import { z } from '@hono/zod-openapi';

export const listSubnetRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all subnets',
  description: 'Retrieves all registered subnets in the system.',
  tags: ['SNMP Subnet'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(SubnetSchema),
        },
      },
      description: 'List of subnets',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
