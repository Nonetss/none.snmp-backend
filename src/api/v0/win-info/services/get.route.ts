import { createRoute } from '@hono/zod-openapi';
import {
  getComputerServicesQuerySchema,
  getComputerServicesResponseSchema,
} from './get.schema';

export const getComputerServicesRoute = createRoute({
  method: 'get',
  path: '/computers/services',
  tags: ['Computers'],
  summary: 'List services and their computers',
  description:
    'Retrieve a list of all running services across all computers, showing which computers have each service running (based on latest data).',
  request: {
    query: getComputerServicesQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getComputerServicesResponseSchema,
        },
      },
      description: 'List of services with associated computers',
    },
  },
});
