import { createRoute, z } from '@hono/zod-openapi';
import { MonitorGroupDetailSchema } from '../group.schema';

export const getMonitorGroupRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get monitoring group by ID',
  tags: ['Monitor Group'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonitorGroupDetailSchema,
        },
      },
      description: 'Group details including devices',
    },
    404: {
      description: 'Group not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
