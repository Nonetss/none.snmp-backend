import { createRoute } from '@hono/zod-openapi';
import {
  DeleteAuthParamsSchema,
  DeleteAuthResponseSchema,
} from './delete.schema';

export const deleteAuthRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  request: {
    params: DeleteAuthParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DeleteAuthResponseSchema,
        },
      },
      description: 'Authentication deleted successfully',
    },
    404: {
      description: 'Authentication not found',
    },
  },
  tags: ['SNMP Authentication'],
});
