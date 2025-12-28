import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceResourcesResponseSchema } from './get.schema';

export const getDeviceResourcesRoute = createRoute({
  method: 'get',
  path: '/{id}/resources',
  summary: 'Get installed applications',
  tags: ['Device Resources'],
  description:
    'Returns a list of all software applications detected as installed on the specified device.',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getDeviceResourcesResponseSchema,
        },
      },
      description: 'List of installed applications',
    },
    404: {
      description: 'Device not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
