import { createRoute } from '@hono/zod-openapi';
import { GetAuthParamsSchema, GetAuthResponseSchema } from './get.schema';

export const getAuthRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get SNMP authentication',
  description:
    'Retrieves the details of a specific SNMP authentication configuration by its ID.',
  request: {
    params: GetAuthParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetAuthResponseSchema,
        },
      },
      description: 'SNMP authentication details',
    },
    404: {
      description: 'Authentication not found',
    },
  },
  tags: ['SNMP Authentication'],
});
