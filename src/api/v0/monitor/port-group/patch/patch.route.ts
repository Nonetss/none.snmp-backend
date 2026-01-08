import { createRoute, z } from '@hono/zod-openapi';
import {
  UpdateMonitorPortGroupSchema,
  MonitorPortGroupSchema,
} from '../port-group.schema';

export const patchMonitorPortGroupRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update port group',
  tags: ['Monitor Port Group'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateMonitorPortGroupSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonitorPortGroupSchema,
        },
      },
      description: 'Group updated successfully',
    },
    404: {
      description: 'Group not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
