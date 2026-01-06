import { createRoute } from '@hono/zod-openapi';
import {
  resourceSearchQuerySchema,
  getResourceSearchResponseSchema,
} from './list.schema';

export const getResourceSearchRoute = createRoute({
  method: 'get',
  path: '/resource',
  summary: 'Search devices by resource (software)',
  tags: ['Search'],
  description:
    'Finds devices that have a specific software installed or devices that are missing it.',
  request: {
    query: resourceSearchQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getResourceSearchResponseSchema,
        },
      },
      description: 'Search results',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
