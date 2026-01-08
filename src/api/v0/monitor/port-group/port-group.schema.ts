import { z } from '@hono/zod-openapi';

export const MonitorPortGroupItemSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  port: z.number().openapi({ example: 80 }),
  expectedStatus: z
    .boolean()
    .openapi({ example: true, description: 'true = open, false = closed' }),
});

export const MonitorPortGroupSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Web Stack' }),
  description: z.string().nullable().openapi({ example: 'Standard web ports' }),
  portCount: z.number().openapi({ example: 2 }),
});

export const MonitorPortGroupDetailSchema = MonitorPortGroupSchema.extend({
  items: z
    .array(MonitorPortGroupItemSchema)
    .openapi({ description: 'Ports included in this group' }),
});

export const CreateMonitorPortGroupSchema = MonitorPortGroupSchema.omit({
  id: true,
  portCount: true,
}).extend({
  items: z
    .array(
      z.object({
        port: z.number().openapi({ example: 80 }),
        expectedStatus: z.boolean().optional().default(true),
      }),
    )
    .optional()
    .openapi({ description: 'Initial list of ports' }),
});

export const UpdateMonitorPortGroupSchema =
  CreateMonitorPortGroupSchema.partial();
