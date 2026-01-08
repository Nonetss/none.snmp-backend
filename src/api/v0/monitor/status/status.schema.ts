import { z } from '@hono/zod-openapi';

export const PortStatusSchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    ruleId: z.number().nullable().openapi({ example: 1 }),
    portGroupItemId: z.number().nullable().openapi({ example: 1 }),
    deviceId: z.number().openapi({ example: 1 }),
    port: z.number().openapi({ example: 80 }),
    status: z.boolean().openapi({ example: true }),
    responseTime: z.number().nullable().openapi({ example: 120 }),
    checkTime: z.string().openapi({ example: '2026-01-08T12:00:00Z' }),
    device: z
      .object({
        id: z.number(),
        name: z.string(),
        ipv4: z.string(),
      })
      .optional(),
    rule: z
      .object({
        id: z.number(),
        name: z.string(),
      })
      .optional(),
    portGroupItem: z
      .object({
        id: z.number(),
        port: z.number(),
        expectedStatus: z.boolean(),
      })
      .optional(),
  })
  .openapi('PortStatus');

export const PortStatusListSchema = z.array(PortStatusSchema);
