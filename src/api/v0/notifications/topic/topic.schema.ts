import { z } from '@hono/zod-openapi';

export const NtfyTopicSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  topic: z.string().openapi({ example: 'alerts' }),
  credentialId: z.number().openapi({ example: 1 }),
  description: z
    .string()
    .nullable()
    .openapi({ example: 'Network alerts topic' }),
});

export const CreateNtfyTopicSchema = z.object({
  topic: z.string().openapi({ example: 'alerts' }),
  credentialId: z.number().openapi({ example: 1 }),
  description: z
    .string()
    .optional()
    .openapi({ example: 'Network alerts topic' }),
});

export const UpdateNtfyTopicSchema = CreateNtfyTopicSchema.partial();

export const NtfyTopicIdParamSchema = z.object({
  id: z.coerce
    .number()
    .openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
});
