import { createRoute, z } from '@hono/zod-openapi';
import { TaskIdParamSchema } from '../scheduler.schema';

export const deleteTaskScheduleRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete a scheduled task',
  tags: ['SNMP Scheduler'],
  request: {
    params: TaskIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Task deleted',
    },
    404: {
      description: 'Task not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
