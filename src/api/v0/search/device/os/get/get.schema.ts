import { z } from '@hono/zod-openapi';
import { DeviceSchema } from '../../../../snmp/device/device.schema';

export const getDeviceByOsResponseSchema = z.array(
  DeviceSchema.extend({
    sysDescr: z.string().nullable(),
  }),
);
