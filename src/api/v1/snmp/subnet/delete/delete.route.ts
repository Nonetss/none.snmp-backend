import { createRoute, z } from '@hono/zod-openapi';
import { SubnetIdParamSchema } from '../subnet.schema';

export const deleteSubnetRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete a subnet by ID',
  tags: ['SNMP Subnet'],
  request: {
    params: SubnetIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Subnet deleted' }),
          }),
        },
      },
      description: 'Subnet deleted',
    },
    404: {
      description: 'Subnet not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
