import { createRoute } from '@hono/zod-openapi';
import {
  DeviceLocationSchema,
  DeviceLocationResponseSchema,
} from './location.schema';

export const patchDeviceLocationRoute = createRoute({
  method: 'patch',
  path: '/',
  summary: 'Assign or remove a location for a single device',
  tags: ['Search', 'Device'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: DeviceLocationSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DeviceLocationResponseSchema,
        },
      },
      description: 'Location updated',
    },
    404: {
      description: 'Device or Location not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
