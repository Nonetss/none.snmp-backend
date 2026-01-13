import { z } from '@hono/zod-openapi';

export const postKomodoAuthRequestSchema = z.object({
  url: z.string().openapi({ example: 'https://komodo.example.com' }),
  key: z.string().openapi({ example: 'your-api-key' }),
  secret: z.string().openapi({ example: 'your-api-secret' }),
});

export const komodoAuthResponseSchema = z.object({
  id: z.number(),
  url: z.string(),
  key: z.string(),
  // We usually don't want to return the secret in full, but for this exercise we might just return the object
  secret: z.string(),
});
