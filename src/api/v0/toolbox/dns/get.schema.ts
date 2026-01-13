import { z } from '@hono/zod-openapi';

export const getDnsRequestSchema = z.object({
  domain: z.string().openapi({
    param: {
      name: 'domain',
      in: 'query',
    },
    example: 'google.com',
  }),
  server: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'server',
        in: 'query',
      },
      example: '8.8.8.8',
    }),
  type: z
    .enum(['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'PTR'])
    .default('A')
    .openapi({
      param: {
        name: 'type',
        in: 'query',
      },
      example: 'A',
    }),
});

export const getDnsResponseSchema = z.object({
  domain: z.string(),
  server: z.string().nullable(),
  type: z.string(),
  answers: z.array(z.any()),
});
