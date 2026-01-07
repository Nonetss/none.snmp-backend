import { z } from '@hono/zod-openapi';

export const DeviceSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  ipv4: z.string().openapi({ example: '10.10.1.40' }),
  name: z.string().nullable().openapi({ example: 'Core-Switch' }),
  subnetId: z.number().openapi({ example: 1 }),
  snmpId: z.number().nullable().openapi({ example: 1 }),
});

export const ListDeviceResponseSchema = z.array(
  DeviceSchema.extend({
    subnet: z
      .object({
        cidr: z.string(),
        name: z.string().nullable(),
      })
      .optional(),
  }),
);
