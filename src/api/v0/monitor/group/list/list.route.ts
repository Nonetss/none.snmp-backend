import { createRoute, z } from '@hono/zod-openapi';
import { MonitorGroupSchema } from '../group.schema';

export const listMonitorGroupsRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all monitoring groups',
  tags: ['Monitor Group'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(MonitorGroupSchema),
        },
      },
      description: 'List of monitoring groups',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
