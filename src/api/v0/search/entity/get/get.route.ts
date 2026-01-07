import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceEntityResponseSchema } from './get.schema';

export const getDeviceEntityRoute = createRoute({
  method: 'get',
  path: '/{id}/entity',
  summary: 'Get Entity physical information',
  tags: ['Device Entity'],
  description:
    'Returns the list of physical entities (chassis, modules, etc.) for the specified device from ENTITY-MIB.',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getDeviceEntityResponseSchema,
        },
      },
      description: 'List of physical entities',
    },
    404: {
      description: 'Device not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
