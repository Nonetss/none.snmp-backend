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

// New Schemas for optimized Get Rule Status
export const PortStatusDataSchema = z
  .object({
    status: z.boolean().openapi({ example: true }),
    checkTime: z.date().openapi({ example: '2026-01-08T12:00:00Z' }),
    responseTime: z
      .number()
      .nullable()
      .openapi({ example: 120, description: 'Response time in milliseconds' }),
  })
  .openapi('PortStatusData');

export const DeviceDataPortSchema = z
  .object({
    port: z.number().openapi({ example: 80 }),
    history: z.array(PortStatusDataSchema),
  })
  .openapi('DeviceDataPort');

export const GroupedPortStatusSchema = z
  .object({
    deviceId: z.number().openapi({ example: 1 }),
    ipv4: z.string().openapi({ example: '192.168.1.1' }),
    deviceName: z.string().nullable().openapi({ example: 'Core-Switch' }),
    ports: z.array(DeviceDataPortSchema),
  })
  .openapi('GroupedPortStatus');

export const RuleDetailsSchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Web Servers Health' }),
    deviceGroupId: z.number().openapi({ example: 1 }),
    portGroupId: z.number().openapi({ example: 1 }),
    enabled: z.boolean().openapi({ example: true }),
    cronExpression: z.string().openapi({ example: '*/5 * * * *' }),
    lastRun: z.date().nullable().openapi({ example: '2026-01-08T12:00:00Z' }),
    nextRun: z.date().nullable().openapi({ example: '2026-01-08T12:05:00Z' }),
    status: z.string().nullable().openapi({ example: 'idle' }),
    lastResult: z.string().nullable(),
    condition: z.string().openapi({ example: 'down' }),
    portGroup: z.object({
      id: z.number(),
      name: z.string(),
      items: z.array(
        z.object({
          id: z.number(),
          port: z.number(),
          expectedStatus: z.boolean(),
        }),
      ),
    }),
    deviceGroup: z.object({
      id: z.number(),
      name: z.string(),
      devices: z.array(
        z.object({
          groupId: z.number(),
          deviceId: z.number(),
        }),
      ),
    }),
  })
  .openapi('RuleDetails');

export const RuleStatusResponseSchema = z
  .object({
    groupedData: z.array(GroupedPortStatusSchema),
    rule: RuleDetailsSchema,
  })
  .openapi('RuleStatusResponse');

export const RuleStatusListResponseSchema = z.array(RuleStatusResponseSchema);
