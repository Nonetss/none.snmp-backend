import { createRoute } from '@hono/zod-openapi';
import {
  ServiceFuzzySearchQuerySchema,
  ServiceFuzzySearchResponseSchema,
} from './search.schema';

export const getServiceFuzzySearchRoute = createRoute({
  method: 'get',
  path: '/fuzzy',
  summary: 'Fuzzy search for services',
  description:
    'Searches for services by name using partial matching and returns the devices where they are running.',
  tags: ['Search'],
  request: {
    query: ServiceFuzzySearchQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ServiceFuzzySearchResponseSchema,
        },
      },
      description: 'Search results',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
