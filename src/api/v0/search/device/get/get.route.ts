import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceSearchResponseSchema } from './get.schema';

export const getDeviceSearchRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Get detailed device info',
  tags: ['Search'],
  description:
    'Returns all available information for a device identified by ID, IP, or MAC.',
  request: {
    query: z.object({
      id: z.string().optional().openapi({ example: '12' }),
      ip: z.string().optional().openapi({ example: '10.10.1.1' }),
      mac: z.string().optional().openapi({ example: '00:11:22:33:44:55' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getDeviceSearchResponseSchema,
        },
      },
      description: 'Device(s) found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
