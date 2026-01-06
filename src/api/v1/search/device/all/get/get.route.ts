import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceAllResponseSchema } from './get.schema';

export const getDeviceAllRoute = createRoute({
  method: 'get',
  path: '/{id}/all',
  summary: 'Get all device inventory data',
  tags: ['Device All'],
  request: { params: z.object({ id: z.string().openapi({ example: '1' }) }) },
  responses: {
    200: {
      content: { 'application/json': { schema: getDeviceAllResponseSchema } },
      description: 'Full inventory',
    },
    500: { description: 'Error' },
  },
});
