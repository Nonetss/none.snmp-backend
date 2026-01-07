import { createRoute } from '@hono/zod-openapi';
import {
  identifyDeviceSchema,
  identifyDeviceResponseSchema,
} from './identify.schema';

export const identifyDeviceRoute = createRoute({
  method: 'get',
  path: '/identify',
  summary: 'Identify a device by IP or MAC',
  description: 'Finds which managed device owns a specific IP or MAC address.',
  tags: ['Search'],
  request: {
    query: identifyDeviceSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: identifyDeviceResponseSchema,
        },
      },
      description: 'Device identified',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
