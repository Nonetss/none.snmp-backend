import { createRoute } from '@hono/zod-openapi';
import {
  getComputersQuerySchema,
  getComputersResponseSchema,
} from './get.schema';

export const getComputersRoute = createRoute({
  method: 'get',
  path: '/computers',
  tags: ['Computers'],
  summary: 'List all computers',
  description:
    'Retrieve a list of all computers registered in the database with their basic information.',
  request: {
    query: getComputersQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getComputersResponseSchema,
        },
      },
      description: 'List of all computers',
    },
  },
});
