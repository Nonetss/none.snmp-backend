import { z } from '@hono/zod-openapi';

export const getDeviceBridgeResponseSchema = z.object({
  base: z
    .object({
      bridgeAddress: z.string().nullable(),
      numPorts: z.number().nullable(),
      type: z.number().nullable(),
      updatedAt: z.string().nullable(),
    })
    .nullable(),
  ports: z.array(
    z.object({
      bridgePort: z.number(),
      ifIndex: z.number().nullable(),
      updatedAt: z.string().nullable(),
    }),
  ),
  fdb: z.array(
    z.object({
      address: z.string(),
      port: z.number(),
      status: z.number().nullable(),
      updatedAt: z.string().nullable(),
    }),
  ),
});
