import { createRoute } from '@hono/zod-openapi';
import { SubnetIdParamSchema, SubnetSchema } from '../subnet.schema';

export const getSubnetRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get a subnet by ID',
  tags: ['SNMP Subnet'],
  request: {
    params: SubnetIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubnetSchema,
        },
      },
      description: 'Subnet found',
    },
    404: {
      description: 'Subnet not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
