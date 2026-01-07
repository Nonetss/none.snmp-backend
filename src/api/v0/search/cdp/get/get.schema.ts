import { z } from '@hono/zod-openapi';

export const getDeviceCdpResponseSchema = z.array(
  z.object({
    id: z.number(),
    deviceId: z.number(),
    interfaceId: z.number().nullable(),
    cdpCacheAddress: z.string().nullable(),
    cdpCacheDeviceId: z.string().nullable(),
    cdpCacheDevicePort: z.string().nullable(),
    cdpCachePlatform: z.string().nullable(),
    cdpCacheCapabilities: z.string().nullable(),
    cdpCacheSysName: z.string().nullable(),
    remoteDeviceId: z.number().nullable(),
    remoteInterfaceId: z.number().nullable(),
    updatedAt: z.string().nullable(),
  }),
);
