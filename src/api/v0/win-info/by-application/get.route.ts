import { createRoute } from '@hono/zod-openapi';
import {
  getComputersByAppQuerySchema,
  getComputersByAppResponseSchema,
} from './get.schema';

export const getComputersByAppRoute = createRoute({
  method: 'get',
  path: '/computers/by-application',
  tags: ['Computers'],
  summary: 'Find computers by application presence',
  description:
    'Retrieve a list of computers that either have or do not have a specific application installed, based on their latest inventory data.',
  request: {
    query: getComputersByAppQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getComputersByAppResponseSchema,
        },
      },
      description: 'List of computers matching the application presence filter',
    },
  },
});
