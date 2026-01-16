import { z } from '@hono/zod-openapi';

export const postPangolinOrgRequestSchema = z.object({
  name: z.string().openapi({ example: 'Default Org' }),
  slug: z.string().openapi({ example: 'default-org' }),
});

export const pangolinOrgResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  authId: z.number(),
});
