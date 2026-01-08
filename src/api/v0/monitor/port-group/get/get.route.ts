import { createRoute, z } from '@hono/zod-openapi';
import { MonitorPortGroupDetailSchema } from '../port-group.schema';

export const getMonitorPortGroupRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get port group by ID',
  tags: ['Monitor Port Group'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonitorPortGroupDetailSchema,
        },
      },
      description: 'Port group details including items',
    },
    404: {
      description: 'Group not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
