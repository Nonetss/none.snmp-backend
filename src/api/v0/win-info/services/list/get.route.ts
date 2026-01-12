import { createRoute } from '@hono/zod-openapi';
import {
  getServiceNamesQuerySchema,
  getServiceNamesResponseSchema,
} from './get.schema';

export const getServiceNamesRoute = createRoute({
  method: 'get',
  path: '/computers/services/list',
  tags: ['Computers'],
  summary: 'List all service names',
  description:
    'Retrieve a unique list of all service names (Name) across all computers.',
  request: {
    query: getServiceNamesQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getServiceNamesResponseSchema,
        },
      },
      description: 'Unique list of service names',
    },
  },
});
