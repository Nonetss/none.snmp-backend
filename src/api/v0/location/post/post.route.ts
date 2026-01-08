import { createRoute, z } from '@hono/zod-openapi';
import { CreateLocationSchema, LocationSchema } from '../location.schema';

export const postLocationRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create a new location',
  tags: ['Location'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateLocationSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: LocationSchema,
        },
      },
      description: 'Location created successfully',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
