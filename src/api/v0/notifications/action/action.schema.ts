import { z } from '@hono/zod-openapi';

export const NotificationActionSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  monitorRuleId: z.number().openapi({ example: 10 }),
  enabled: z.boolean().openapi({ example: true }),
  type: z.enum(['ntfy', 'email']).openapi({ example: 'ntfy' }),
  consecutiveFailures: z.number().openapi({ example: 1 }),
  repeatIntervalMins: z.number().openapi({ example: 60 }),
  deviceAggregation: z.enum(['any', 'all']).openapi({ example: 'any' }),
  portAggregation: z.enum(['any', 'all']).openapi({ example: 'any' }),
  lastSentAt: z
    .string()
    .nullable()
    .openapi({ example: '2026-01-08T12:00:00Z' }),
});

export const CreateNotificationActionSchema = z.object({
  monitorRuleId: z.number().openapi({ example: 10 }),
  enabled: z.boolean().optional().default(true).openapi({ example: true }),
  type: z.enum(['ntfy', 'email']).openapi({ example: 'ntfy' }),
  consecutiveFailures: z.number().optional().default(1).openapi({ example: 1 }),
  repeatIntervalMins: z
    .number()
    .optional()
    .default(60)
    .openapi({ example: 60 }),
  deviceAggregation: z
    .enum(['any', 'all'])
    .optional()
    .default('any')
    .openapi({ example: 'any' }),
  portAggregation: z
    .enum(['any', 'all'])
    .optional()
    .default('any')
    .openapi({ example: 'any' }),
});

export const UpdateNotificationActionSchema =
  CreateNotificationActionSchema.partial();

export const NotificationActionIdParamSchema = z.object({
  id: z.coerce
    .number()
    .openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
});

// Ntfy Action Schema (Separate CRUD or nested?)
export const NtfyActionSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  notificationActionId: z.number().openapi({ example: 1 }),
  ntfyTopicId: z.number().nullable().openapi({ example: 5 }),
  title: z.string().nullable().openapi({ example: 'Alert' }),
  priority: z.number().nullable().openapi({ example: 4 }),
});

export const CreateNtfyActionSchema = z.object({
  notificationActionId: z.number().openapi({ example: 1 }),
  ntfyTopicId: z.number().optional().openapi({ example: 5 }),
  title: z.string().optional().openapi({ example: 'Alert' }),
  priority: z.number().optional().openapi({ example: 4 }),
  tags: z
    .array(z.string())
    .optional()
    .openapi({ example: ['warning', 'network'] }),
});
