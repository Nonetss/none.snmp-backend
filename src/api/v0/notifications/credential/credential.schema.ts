import { z } from '@hono/zod-openapi';

export const NtfyCredentialSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'My ntfy Server' }),
  baseUrl: z.string().openapi({ example: 'https://ntfy.sh' }),
  username: z.string().nullable().openapi({ example: 'user' }),
  password: z.string().nullable().openapi({ example: 'password' }),
  token: z.string().nullable().openapi({ example: 'tk_123' }),
});

export const CreateNtfyCredentialSchema = z.object({
  name: z.string().openapi({ example: 'My ntfy Server' }),
  baseUrl: z
    .string()
    .optional()
    .default('https://ntfy.sh')
    .openapi({ example: 'https://ntfy.sh' }),
  username: z.string().nullable().optional().openapi({ example: 'user' }),
  password: z.string().nullable().optional().openapi({ example: 'password' }),
  token: z.string().nullable().optional().openapi({ example: 'tk_123' }),
});

export const UpdateNtfyCredentialSchema = CreateNtfyCredentialSchema.partial();

export const NtfyCredentialIdParamSchema = z.object({
  id: z.coerce
    .number()
    .openapi({ param: { name: 'id', in: 'path' }, example: 1 }),
});
