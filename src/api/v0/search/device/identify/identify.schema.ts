import { z } from '@hono/zod-openapi';

export const identifyDeviceSchema = z.object({
  ip: z.string().optional().openapi({
    example: '10.10.1.1',
    description: 'Search by any IP associated with the device',
  }),
  mac: z.string().optional().openapi({
    example: '00:11:22:33:44:55',
    description: 'Search by any MAC address associated with the device',
  }),
});

export const identifyDeviceResponseSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string().nullable(),
    managementIp: z.string(),
    matchType: z.enum(['management_ip', 'interface_ip', 'mac_address']),
    matchedValue: z.string(),
    sysName: z.string().nullable(),
  }),
);
