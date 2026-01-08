import { createRoute, z } from '@hono/zod-openapi';
import { UpdateLocationSchema, LocationSchema } from '../location.schema';

export const patchLocationRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update a location',
  tags: ['Location'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateLocationSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LocationSchema,
        },
      },
      description: 'Location updated successfully',
    },
    404: {
      description: 'Location not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
