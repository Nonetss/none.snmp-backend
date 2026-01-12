import { createRoute } from '@hono/zod-openapi';
import {
  getComputerRamQuerySchema,
  getComputerRamResponseSchema,
} from './get.schema';

export const getComputerRamRoute = createRoute({
  method: 'get',
  path: '/computers/ram',
  tags: ['Computers'],
  summary: 'Filter computers by RAM',
  description:
    'Find computers based on a minimum or maximum amount of physical RAM (specified in GB).',
  request: {
    query: getComputerRamQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getComputerRamResponseSchema,
        },
      },
      description: 'Filtered list of computers',
    },
  },
});
