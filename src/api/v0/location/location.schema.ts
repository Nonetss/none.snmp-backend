import { z } from '@hono/zod-openapi';
import { DeviceSchema } from '@/api/v0/snmp/device/device.schema';

export const LocationSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Data Center 1' }),
  description: z.string().nullable().openapi({ example: 'Main data center' }),
  parentId: z.number().nullable().openapi({ example: null }),
  deviceCount: z.number().optional().openapi({ example: 5 }),
});

export const CreateLocationSchema = LocationSchema.omit({
  id: true,
  deviceCount: true,
});
export const UpdateLocationSchema = CreateLocationSchema.partial();

export const GetLocationDetailResponseSchema = LocationSchema.extend({
  subnets: z
    .array(
      z.object({
        id: z.number(),
        cidr: z.string(),
        name: z.string().nullable(),
        devices: z.array(DeviceSchema),
      }),
    )
    .openapi({ description: 'Subnets and their devices in this location' }),
  children: z.array(LocationSchema).openapi({ description: 'Sub-locations' }),
});
