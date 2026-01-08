import { createRoute, z } from '@hono/zod-openapi';
import { GetLocationDetailResponseSchema } from '../location.schema';

export const getLocationRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get a location by ID',
  tags: ['Location'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: GetLocationDetailResponseSchema,
        },
      },
      description: 'The location details',
    },
    404: {
      description: 'Location not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
