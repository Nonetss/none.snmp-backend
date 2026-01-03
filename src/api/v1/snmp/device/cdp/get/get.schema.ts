import { z } from '@hono/zod-openapi';

export const getDeviceCdpResponseSchema = z.array(
  z.object({
    id: z.number(),
    deviceId: z.number(),
    interfaceId: z.number().nullable(),
    ifIndex: z.number(),
    neighborIndex: z.number(),
    address: z.string().nullable(),
    neighborDeviceId: z.string().nullable(),
    neighborPort: z.string().nullable(),
    neighborPlatform: z.string().nullable(),
    neighborSysName: z.string().nullable(),
    remoteDeviceId: z.number().nullable(),
    remoteInterfaceId: z.number().nullable(),
    updatedAt: z.string().nullable(),
  }),
);
