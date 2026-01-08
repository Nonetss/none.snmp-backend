import { createRoute, z } from '@hono/zod-openapi';
import { MonitorPortGroupSchema } from '../port-group.schema';

export const listMonitorPortGroupsRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List all port groups',
  tags: ['Monitor Port Group'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(MonitorPortGroupSchema),
        },
      },
      description: 'List of port groups',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
