import { createRoute } from '@hono/zod-openapi';
import { listDeviceStatusResponseSchema } from './status.schema';

export const listDeviceStatusRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all device statuses',
  tags: ['Device Search'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: listDeviceStatusResponseSchema,
        },
      },
      description: 'List of device statuses',
    },
  },
});
