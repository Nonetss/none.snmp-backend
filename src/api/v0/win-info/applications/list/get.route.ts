import { createRoute } from '@hono/zod-openapi';
import {
  getApplicationNamesQuerySchema,
  getApplicationNamesResponseSchema,
} from './get.schema';

export const getApplicationNamesRoute = createRoute({
  method: 'get',
  path: '/computers/applications/list',
  tags: ['Computers'],
  summary: 'List all application names',
  description:
    'Retrieve a unique list of all installed application names across all computers.',
  request: {
    query: getApplicationNamesQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getApplicationNamesResponseSchema,
        },
      },
      description: 'Unique list of application names',
    },
  },
});
