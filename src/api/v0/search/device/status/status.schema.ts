import { z } from '@hono/zod-openapi';

export const deviceStatusSchema = z.object({
  deviceId: z.number(),
  ipv4: z.string(),
  name: z.string().nullable(),
  status: z.boolean(),
  lastPing: z.string().nullable(),
  lastPingUp: z.string().nullable(),
});

export const listDeviceStatusResponseSchema = z.array(deviceStatusSchema);
