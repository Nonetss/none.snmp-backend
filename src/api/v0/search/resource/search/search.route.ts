import { createRoute } from '@hono/zod-openapi';
import {
  ResourceFuzzySearchQuerySchema,
  ResourceFuzzySearchResponseSchema,
} from './search.schema';

export const getResourceFuzzySearchRoute = createRoute({
  method: 'get',
  path: '/fuzzy',
  summary: 'Fuzzy search for applications',
  description:
    'Searches for applications by name using partial matching and returns the devices where they are installed.',
  tags: ['Search'],
  request: {
    query: ResourceFuzzySearchQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResourceFuzzySearchResponseSchema,
        },
      },
      description: 'Search results',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
