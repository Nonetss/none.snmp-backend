import { z } from '@hono/zod-openapi';
import { MonitorGroupSchema } from '../group/group.schema';
import { MonitorPortGroupSchema } from '../port-group/port-group.schema';

export const MonitorRuleSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Web Servers Health' }),
  deviceGroupId: z.number().openapi({ example: 1 }),
  portGroupId: z.number().openapi({ example: 1 }),
  enabled: z.boolean().openapi({ example: true }),
  cronExpression: z.string().openapi({ example: '*/5 * * * *' }),
  lastRun: z.string().nullable().openapi({ example: '2026-01-06T12:00:00Z' }),
  nextRun: z.string().nullable().openapi({ example: '2026-01-07T00:00:00Z' }),
  status: z.enum(['idle', 'running', 'error']).openapi({ example: 'idle' }),
  lastResult: z.string().nullable().openapi({ example: 'Success' }),
});

export const MonitorRuleDetailSchema = MonitorRuleSchema.extend({
  deviceGroup: MonitorGroupSchema.openapi({
    description: 'Associated device group',
  }),
  portGroup: MonitorPortGroupSchema.openapi({
    description: 'Associated port group',
  }),
});

export const CreateMonitorRuleSchema = MonitorRuleSchema.omit({
  id: true,
  lastRun: true,
  nextRun: true,
  status: true,
  lastResult: true,
});

export const UpdateMonitorRuleSchema = CreateMonitorRuleSchema.partial();
