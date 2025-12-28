import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceInterfacesResponseSchema } from './get.schema';

export const getDeviceInterfacesRoute = createRoute({
  method: 'get',
  path: '/{id}/interfaces',
  summary: 'Get network interfaces inventory',
  tags: ['Device Interfaces'],
  description:
    'Returns the static inventory of network interfaces for the specified device.',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getDeviceInterfacesResponseSchema,
        },
      },
      description: 'List of network interfaces',
    },
    404: {
      description: 'Device not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
