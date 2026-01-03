import { z } from '@hono/zod-openapi';

export const deviceSearchResultSchema = z.object({
  deviceId: z.number(),
  deviceName: z.string().nullable(),
  deviceIpv4: z.string(),
  macAddress: z.string().nullable(),
  assignedIp: z.string().nullable(),
  ifIndex: z.number().nullable(),
  ifName: z.string().nullable(),
  ifDescr: z.string().nullable(),
  lastSeen: z.string(),
  system: z
    .object({
      sysDescr: z.string().nullable(),
      sysUpTime: z.string().nullable(),
      sysContact: z.string().nullable(),
      sysName: z.string().nullable(),
      sysLocation: z.string().nullable(),
      sysServices: z.number().nullable(),
    })
    .nullable(),
});

export const getDeviceSearchResponseSchema = z.array(deviceSearchResultSchema);
