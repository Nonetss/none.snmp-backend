import { createRoute } from '@hono/zod-openapi';
import {
  getComputerStorageQuerySchema,
  getComputerStorageResponseSchema,
} from './get.schema';

export const getComputerStorageRoute = createRoute({
  method: 'get',
  path: '/computers/storage',
  tags: ['Computers'],
  summary: 'Filter computers by Storage',
  description:
    'Find computers based on their total storage capacity across all drives (specified in GB), based on the latest data.',
  request: {
    query: getComputerStorageQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getComputerStorageResponseSchema,
        },
      },
      description: 'Filtered list of computers with their total storage',
    },
  },
});
