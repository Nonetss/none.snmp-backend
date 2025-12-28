import { z } from '@hono/zod-openapi';

export const getDeviceSystemResponseSchema = z.object({
  sysDescr: z.string().nullable(),
  sysUpTime: z.string().nullable(),
  sysContact: z.string().nullable(),
  sysName: z.string().nullable(),
  sysLocation: z.string().nullable(),
  sysServices: z.number().nullable(),
});
