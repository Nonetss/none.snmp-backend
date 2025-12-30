import { z } from '@hono/zod-openapi';

export const getDeviceRouteResponseSchema = z.array(
  z.object({
    id: z.number(),
    dest: z.string(),
    mask: z.string().nullable(),
    pfxLen: z.number().nullable(),
    nextHop: z.string(),
    ifIndex: z.number().nullable(),
    type: z.number().nullable(),
    proto: z.number().nullable(),
    age: z.number().nullable(),
    metric1: z.number().nullable(),
    metric2: z.number().nullable(),
    metric3: z.number().nullable(),
    metric4: z.number().nullable(),
    metric5: z.number().nullable(),
    updatedAt: z.string().nullable(),
  }),
);
