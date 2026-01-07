import { z } from '@hono/zod-openapi';

export const deviceServiceSchema = z.object({
  id: z.number(),
  index: z.number(),
  name: z.string(),
  path: z.string(),
  parameters: z.string(),
  type: z.number(),
  status: z.number(),
  cpu: z.number().nullable(),
  mem: z.number().nullable(),
  lastSeen: z.string(),
});

export const getDeviceServicesResponseSchema = z.array(deviceServiceSchema);
