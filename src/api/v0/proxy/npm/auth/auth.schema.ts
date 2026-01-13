import { z } from '@hono/zod-openapi';

export const postNpmAuthRequestSchema = z.object({
  url: z.string().openapi({ example: 'https://npm.example.com' }),
  username: z.string().openapi({ example: 'admin@example.com' }),
  password: z.string().openapi({ example: 'your-password' }),
});

export const npmAuthResponseSchema = z.object({
  id: z.number(),
  url: z.string(),
  username: z.string(),
  password: z.string(),
});
