import { createRoute } from '@hono/zod-openapi';
import {
  CreateTaskScheduleSchema,
  TaskScheduleSchema,
} from '../scheduler.schema';

export const postTaskScheduleRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create a new scheduled task',
  tags: ['SNMP Scheduler'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateTaskScheduleSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: TaskScheduleSchema,
        },
      },
      description: 'Task created',
    },
    400: {
      description: 'Invalid input',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
