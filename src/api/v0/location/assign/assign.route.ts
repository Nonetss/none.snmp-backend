import { createRoute } from '@hono/zod-openapi';
import {
  AssignLocationSchema,
  AssignLocationResponseSchema,
} from './assign.schema';

export const assignLocationRoute = createRoute({
  method: 'post',
  path: '/assign',
  summary: 'Assign location to devices (by subnets or list)',
  tags: ['Location'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AssignLocationSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: AssignLocationResponseSchema,
        },
      },
      description: 'Devices assigned successfully',
    },
    400: {
      description: 'Invalid request parameters',
    },
    404: {
      description: 'Location or Subnets not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
