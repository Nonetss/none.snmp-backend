import { createRoute } from '@hono/zod-openapi';
import { CreateSubnetSchema, SubnetSchema } from '../subnet.schema';

export const postSubnetRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create a new subnet',
  tags: ['SNMP Subnet'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateSubnetSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: SubnetSchema,
        },
      },
      description: 'Subnet created',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
