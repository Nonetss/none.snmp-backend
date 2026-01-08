import { z } from '@hono/zod-openapi';
import { DeviceSchema } from '../../snmp/device/device.schema';

export const MonitorGroupSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Critical Servers' }),
  description: z
    .string()
    .nullable()
    .openapi({ example: 'Main production servers group' }),
  deviceCount: z.number().openapi({ example: 5 }),
  createdAt: z.string().openapi({ example: '2024-01-01T00:00:00Z' }),
});

export const MonitorGroupDetailSchema = MonitorGroupSchema.extend({
  devices: z
    .array(DeviceSchema)
    .openapi({ description: 'Devices in this group' }),
});

export const CreateMonitorGroupSchema = MonitorGroupSchema.omit({
  id: true,
  deviceCount: true,
  createdAt: true,
}).extend({
  deviceIds: z
    .array(z.number())
    .optional()
    .openapi({
      example: [1, 2, 3],
      description: 'Optional list of device IDs to add to the group',
    }),
});

export const UpdateMonitorGroupSchema = CreateMonitorGroupSchema.partial();
