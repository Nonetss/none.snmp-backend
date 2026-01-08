import { createRoute, z } from '@hono/zod-openapi';
import { UpdateMonitorGroupSchema, MonitorGroupSchema } from '../group.schema';

export const patchMonitorGroupRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update monitoring group',
  tags: ['Monitor Group'],
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateMonitorGroupSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: MonitorGroupSchema,
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
