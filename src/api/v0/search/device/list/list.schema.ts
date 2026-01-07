import { z } from '@hono/zod-openapi';

export const listDevicesResponseSchema = z.array(
  z.object({
    id: z.number(),
    cidr: z.string(),
    name: z.string().nullable(),
    devices: z.array(
      z.object({
        id: z.number(),
        name: z.string().nullable(),
        ipv4: z.string(),
        status: z.boolean(),
        macAddress: z.string().nullable(),
        sysName: z.string().nullable(),
        sysLocation: z.string().nullable(),
        sysDescr: z.string().nullable(),
      }),
    ),
  }),
);
