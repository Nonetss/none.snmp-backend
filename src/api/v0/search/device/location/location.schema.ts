import { z } from '@hono/zod-openapi';

export const DeviceLocationSchema = z.object({
  deviceId: z.number().openapi({ example: 5, description: 'ID of the device' }),
  locationId: z
    .number()
    .nullable()
    .openapi({
      example: 1,
      description: 'ID of the location, or null to unassign',
    }),
});

export const DeviceLocationResponseSchema = z.object({
  message: z.string().openapi({ example: 'Location updated successfully' }),
  deviceId: z.number(),
  locationId: z.number().nullable(),
});
