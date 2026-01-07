import { createRoute } from '@hono/zod-openapi';
import {
  TaskIdParamSchema,
  UpdateTaskScheduleSchema,
  TaskScheduleSchema,
} from '../scheduler.schema';

export const patchTaskScheduleRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update a scheduled task',
  tags: ['SNMP Scheduler'],
  request: {
    params: TaskIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateTaskScheduleSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TaskScheduleSchema,
        },
      },
      description: 'Task updated',
    },
    404: {
      description: 'Task not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
