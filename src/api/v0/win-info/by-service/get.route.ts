import { createRoute } from '@hono/zod-openapi';
import {
  getComputersByServiceQuerySchema,
  getComputersByServiceResponseSchema,
} from './get.schema';

export const getComputersByServiceRoute = createRoute({
  method: 'get',
  path: '/computers/by-service',
  tags: ['Computers'],
  summary: 'Find computers by service presence',
  description:
    'Retrieve a list of computers that either have or do not have a specific service running, based on their latest inventory data.',
  request: {
    query: getComputersByServiceQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getComputersByServiceResponseSchema,
        },
      },
      description: 'List of computers matching the service presence filter',
    },
  },
});
