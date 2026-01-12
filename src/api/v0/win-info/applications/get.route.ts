import { createRoute } from '@hono/zod-openapi';
import {
  getComputerApplicationsQuerySchema,
  getComputerApplicationsResponseSchema,
} from './get.schema';

export const getComputerApplicationsRoute = createRoute({
  method: 'get',
  path: '/computers/applications',
  tags: ['Computers'],
  summary: 'List applications and their computers',
  description:
    'Retrieve a list of all installed applications across all computers, showing which computers have each application installed (based on latest data).',
  request: {
    query: getComputerApplicationsQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getComputerApplicationsResponseSchema,
        },
      },
      description: 'List of applications with associated computers',
    },
  },
});
