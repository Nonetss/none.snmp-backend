import { z } from '@hono/zod-openapi';

export const getTracerouteRequestSchema = z.object({
  host: z.string().openapi({
    param: {
      name: 'host',
      in: 'query',
    },
    example: '8.8.8.8',
  }),
});

export const getTracerouteResponseSchema = z.object({
  host: z.string(),
  hops: z.array(
    z.object({
      hop: z.number(),
      ip: z.string().nullable(),
      rtt: z.array(z.string()),
    }),
  ),
});
