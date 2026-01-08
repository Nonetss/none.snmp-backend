import { z } from '@hono/zod-openapi';

export const TagSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Critical' }),
  color: z.string().nullable().openapi({ example: '#FF0000' }),
});

export const CreateTagSchema = TagSchema.omit({ id: true });
export const UpdateTagSchema = CreateTagSchema.partial();
