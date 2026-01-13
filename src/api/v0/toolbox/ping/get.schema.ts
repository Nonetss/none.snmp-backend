import { z } from '@hono/zod-openapi';

export const getPingRequestSchema = z.object({
  host: z.string().openapi({
    param: {
      name: 'host',
      in: 'query',
    },
    example: '8.8.8.8',
  }),
});

export const getPingResponseSchema = z.object({
  host: z.string(),
  alive: z.boolean(),
  time: z.union([z.number(), z.string()]),
  output: z.string().optional(),
});
