import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceByOsResponseSchema } from './get.schema';

export const getDeviceByOsRoute = createRoute({
  method: 'get',
  path: '/os',
  summary: 'Search devices by operating system',
  description:
    'Retrieves devices whose system description matches the given OS string.',
  request: {
    query: z.object({
      q: z.string().openapi({
        description: 'OS name or system description substring',
        example: 'Linux',
      }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getDeviceByOsResponseSchema,
        },
      },
      description: 'List of devices matching the OS search',
    },
    500: { description: 'Internal server error' },
  },
  tags: ['Search Device', 'Search'],
});
