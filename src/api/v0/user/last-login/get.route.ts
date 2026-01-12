import { createRoute } from '@hono/zod-openapi';
import {
  getLastLoginQuerySchema,
  getLastLoginResponseSchema,
} from './get.schema';

export const getLastLoginRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['User'],
  summary: 'Get last login info for a computer',
  description:
    'Retrieve the latest login information for a specific computer by name or IP.',
  request: {
    query: getLastLoginQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getLastLoginResponseSchema,
        },
      },
      description: 'Last login information',
    },
    404: {
      description: 'Computer or login session not found',
    },
  },
});
