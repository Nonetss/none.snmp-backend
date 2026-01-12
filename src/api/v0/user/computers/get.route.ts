import { createRoute } from '@hono/zod-openapi';
import {
  getComputersByUserQuerySchema,
  getComputersByUserResponseSchema,
} from './get.schema';

export const getComputersByUserRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Users'],
  summary: 'Get computers used by a user',
  description:
    'Retrieve a list of all computers where a specific user has logged in, including the last login timestamp for each.',
  request: {
    query: getComputersByUserQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getComputersByUserResponseSchema,
        },
      },
      description: 'List of computers used by the user',
    },
    404: {
      description: 'User not found',
    },
  },
});
