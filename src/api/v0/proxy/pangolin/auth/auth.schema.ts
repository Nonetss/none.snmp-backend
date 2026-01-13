import { z } from '@hono/zod-openapi';

export const postPangolinAuthRequestSchema = z.object({
  url: z.string().openapi({ example: 'https://pangolin.example.com' }),
  token: z.string().openapi({ example: 'your-token' }),
  orgName: z.string().openapi({ example: 'Default Org' }),
  orgSlug: z.string().openapi({ example: 'default-org' }),
});

export const pangolinAuthResponseSchema = z.object({
  id: z.number(),
  url: z.string(),
  token: z.string(),
  org: z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
  }),
});
