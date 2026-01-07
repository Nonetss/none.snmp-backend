import { createRoute } from '@hono/zod-openapi';
import {
  serviceSearchQuerySchema,
  getServiceSearchResponseSchema,
} from './list.schema';

export const getServiceSearchRoute = createRoute({
  method: 'get',
  path: '/service',
  summary: 'Search devices by service (process)',
  tags: ['Search'],
  description:
    'Finds devices that have a specific process running or devices that are missing it.',
  request: {
    query: serviceSearchQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getServiceSearchResponseSchema,
        },
      },
      description: 'Search results',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
