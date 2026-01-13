import { createRoute, z } from '@hono/zod-openapi';

export const deleteDnsServerRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete a DNS server',
  tags: ['Toolbox DNS Servers'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    204: {
      description: 'DNS server deleted',
    },
    404: {
      description: 'DNS server not found',
    },
    500: {
      description: 'Internal server error',
    },
  },
});
