import { z } from '@hono/zod-openapi';
import { TagSchema } from '../../../tag/tag.schema';
import { LocationSchema } from '../../../location/location.schema';

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
        tags: z.array(TagSchema),
        location: LocationSchema.nullable(),
      }),
    ),
  }),
);
