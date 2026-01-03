import { z } from '@hono/zod-openapi';

export const getDeviceLldpResponseSchema = z.array(
  z.object({
    id: z.number(),
    deviceId: z.number(),
    interfaceId: z.number().nullable(),
    localPortNum: z.number(),
    neighborIndex: z.number(),
    chassisIdSubtype: z.number().nullable(),
    chassisId: z.string().nullable(),
    portIdSubtype: z.number().nullable(),
    portId: z.string().nullable(),
    portDesc: z.string().nullable(),
    sysName: z.string().nullable(),
    sysDesc: z.string().nullable(),
    sysCapSupported: z.string().nullable(),
    sysCapEnabled: z.string().nullable(),
    mgmtAddress: z.string().nullable(),
    remoteDeviceId: z.number().nullable(),
    remoteInterfaceId: z.number().nullable(),
    updatedAt: z.string().nullable(),
  }),
);
