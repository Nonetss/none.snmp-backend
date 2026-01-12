import { createRoute } from '@hono/zod-openapi';
import {
  getComputerModelsQuerySchema,
  getComputerModelsResponseSchema,
} from './get.schema';

export const getComputerModelsRoute = createRoute({
  method: 'get',
  path: '/computers/models',
  tags: ['Computers'],
  summary: 'List computers grouped by model',
  description:
    'Retrieve a list of all computers grouped by their hardware model.',
  request: {
    query: getComputerModelsQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getComputerModelsResponseSchema,
        },
      },
      description: 'Computers grouped by model',
    },
  },
});
