import { z } from '@hono/zod-openapi';

export const PortHistoryItemSchema = z
  .object({
    checkTime: z.string().openapi({ example: '2026-01-08T12:00:00Z' }),
    status: z.boolean().openapi({ example: true }),
    responseTime: z.number().nullable().openapi({ example: 120 }),
  })
  .openapi('PortHistoryItem');

export const DeviceStatusHistorySchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Core-Switch' }),
    ipv4: z.string().openapi({ example: '192.168.1.1' }),
    history: z.array(PortHistoryItemSchema),
  })
  .openapi('DeviceStatusHistory');

export const PortStatusHistorySchema = z
  .object({
    portGroupItemId: z.number().openapi({ example: 1 }),
    port: z.number().openapi({ example: 80 }),
    expectedStatus: z.boolean().openapi({ example: true }),
    devices: z.array(DeviceStatusHistorySchema),
  })
  .openapi('PortStatusHistory');

export const RuleStatusHistorySchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Web Servers Health' }),
    enabled: z.boolean().openapi({ example: true }),
    cronExpression: z.string().openapi({ example: '*/5 * * * *' }),
    lastRun: z.string().nullable().openapi({ example: '2026-01-08T12:00:00Z' }),
    status: z.string().nullable().openapi({ example: 'idle' }),
    ports: z.array(PortStatusHistorySchema),
  })
  .openapi('RuleStatusHistory');

export const RuleStatusHistoryListSchema = z.array(RuleStatusHistorySchema);
