import { z } from '@hono/zod-openapi';

export const getDeviceLldpResponseSchema = z.array(
  z.object({
    id: z.number(),
    deviceId: z.number(),
    interfaceId: z.number().nullable(),
    lldpRemChassisId: z.string().nullable(),
    lldpRemPortIdSubtype: z.number().nullable(),
    lldpRemPortId: z.string().nullable(),
    lldpRemSysName: z.string().nullable(),
    remoteDeviceId: z.number().nullable(),
    remoteInterfaceId: z.number().nullable(),
    updatedAt: z.string().nullable(),
  }),
);
