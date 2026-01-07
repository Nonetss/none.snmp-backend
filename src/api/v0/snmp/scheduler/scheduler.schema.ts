import { z } from '@hono/zod-openapi';

export const TaskScheduleSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Daily Full Poll' }),
  type: z
    .enum([
      'SCAN_SUBNET',
      'SCAN_ALL_SUBNETS',
      'POLL_ALL',
      'POLL_DEVICE',
      'PING_ALL',
    ])
    .openapi({ example: 'POLL_ALL' }),
  targetId: z.number().nullable().openapi({ example: null }),
  cronExpression: z.string().openapi({ example: '0 0 * * *' }),
  enabled: z.boolean().openapi({ example: true }),
  lastRun: z.string().nullable().openapi({ example: '2026-01-06T12:00:00Z' }),
  nextRun: z.string().nullable().openapi({ example: '2026-01-07T00:00:00Z' }),
  status: z.enum(['idle', 'running', 'error']).openapi({ example: 'idle' }),
  lastResult: z.string().nullable().openapi({ example: 'Success' }),
});

export const CreateTaskScheduleSchema = z.object({
  name: z.string().openapi({ example: 'Daily Full Poll' }),
  type: z.enum([
    'SCAN_SUBNET',
    'SCAN_ALL_SUBNETS',
    'POLL_ALL',
    'POLL_DEVICE',
    'PING_ALL',
  ]),
  targetId: z.coerce.number().optional().openapi({ example: 1 }),
  cronExpression: z.string().openapi({ example: '0 0 * * *' }),
  enabled: z.boolean().optional().default(true),
});

export const UpdateTaskScheduleSchema = CreateTaskScheduleSchema.partial();

export const TaskIdParamSchema = z.object({
  id: z.coerce
    .number()
    .openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
});
