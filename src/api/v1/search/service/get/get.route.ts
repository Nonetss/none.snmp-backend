import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceServicesResponseSchema } from './get.schema';

export const getDeviceServicesRoute = createRoute({
  method: 'get',
  path: '/{id}/services',
  summary: 'Get running services/processes',
  tags: ['Device Resources'],
  description:
    'Returns a list of all running processes detected on the specified device, including CPU and memory usage.',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': { schema: getDeviceServicesResponseSchema },
      },
      description: 'List of running services',
    },
    404: { description: 'Device not found' },
    500: { description: 'Internal server error' },
  },
});
