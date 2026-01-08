import { createRoute, z } from '@hono/zod-openapi';
import { SubnetLocationStatusSchema } from '../subnet.schema';

export const getSubnetsWithLocationStatusRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get subnets with their devices and location status',
  tags: ['Location'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(SubnetLocationStatusSchema),
        },
      },
      description: 'List of subnets with location status',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
