import { z } from '@hono/zod-openapi';

export const getDeviceCdpResponseSchema = z.array(
  z.object({
    id: z.number(),
    ifIndex: z.number(),
    neighborIndex: z.number(),
    address: z.string().nullable(),
    neighborDeviceId: z.string().nullable(),
    neighborPort: z.string().nullable(),
    neighborPlatform: z.string().nullable(),
    neighborSysName: z.string().nullable(),
    updatedAt: z.string().nullable(),
  }),
);
