import { createRoute, z } from '@hono/zod-openapi';
import { getDeviceSystemResponseSchema } from './get.schema';

export const getDeviceSystemRoute = createRoute({
  method: 'get',
  path: '/{id}/system',
  summary: 'Get device system information',
  tags: ['Device System'],
  request: { params: z.object({ id: z.string().openapi({ example: '1' }) }) },
  responses: {
    200: {
      content: {
        'application/json': { schema: getDeviceSystemResponseSchema },
      },
      description: 'System info',
    },
    404: { description: 'Not found' },
    500: { description: 'Error' },
  },
});
