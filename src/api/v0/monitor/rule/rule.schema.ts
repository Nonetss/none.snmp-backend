import { z } from '@hono/zod-openapi';
import { MonitorGroupSchema } from '../group/group.schema';
import { MonitorPortGroupSchema } from '../port-group/port-group.schema';

export const MonitorRuleSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Web Servers Health' }),
  deviceGroupId: z.number().openapi({ example: 1 }),
  portGroupId: z.number().openapi({ example: 1 }),
  enabled: z.boolean().openapi({ example: true }),
});

export const MonitorRuleDetailSchema = MonitorRuleSchema.extend({
  deviceGroup: MonitorGroupSchema.openapi({
    description: 'Associated device group',
  }),
  portGroup: MonitorPortGroupSchema.openapi({
    description: 'Associated port group',
  }),
});

export const CreateMonitorRuleSchema = MonitorRuleSchema.omit({ id: true });
export const UpdateMonitorRuleSchema = CreateMonitorRuleSchema.partial();
