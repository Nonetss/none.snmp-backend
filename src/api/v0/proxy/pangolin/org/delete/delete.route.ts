import { createRoute, z } from '@hono/zod-openapi';

export const deletePangolinOrgRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete Pangolin organization by ID',
  tags: ['Pangolin Org'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      description: 'Pangolin organization deleted',
    },
    404: {
      description: 'Organization not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
