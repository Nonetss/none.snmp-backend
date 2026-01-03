import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceSearchResponseSchema } from './get.schema';

export const getDeviceSearchRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'Search device by IP or MAC',
  tags: ['Search'],
  description:
    'Searches the registered devices using an IP address or a MAC address.',
  request: {
    query: z.object({
      q: z.string().openapi({ example: '10.10.1.1' }),
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
