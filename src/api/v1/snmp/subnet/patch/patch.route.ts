import { createRoute } from '@hono/zod-openapi';
import {
  SubnetIdParamSchema,
  UpdateSubnetSchema,
  SubnetSchema,
} from '../subnet.schema';

export const patchSubnetRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update a subnet by ID',
  tags: ['SNMP Subnet'],
  request: {
    params: SubnetIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateSubnetSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubnetSchema,
        },
      },
      description: 'Subnet updated',
    },
    404: {
      description: 'Subnet not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
