import { z } from '@hono/zod-openapi';

export const postPangolinAuthRequestSchema = z.object({
  url: z.string().openapi({ example: 'https://pangolin.example.com' }),
  token: z.string().openapi({ example: 'your-token' }),
});

export const pangolinAuthResponseSchema = z.object({
  id: z.number(),
  url: z.string(),
  token: z.string(),
});

export const pangolinAuthMetadataResponseSchema = z.object({
  exists: z.boolean(),
  total_auth: z.number(),
  total_org: z.number(),
});

export const pangolinAuthGetResponseSchema = z.object({
  auth: pangolinAuthResponseSchema.nullable(),
  metadata: pangolinAuthMetadataResponseSchema,
});
