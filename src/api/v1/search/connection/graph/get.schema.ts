import { z } from '@hono/zod-openapi';

export const networkEdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  sourcePort: z.string(),
  targetPort: z.string(),
  protocol: z.string(),
});

export const getSwitchConnectionsResponseSchema = z.array(
  z.object({
    source: z.object({
      id: z.number(),
      name: z.string().nullable(),
      ip: z.string(),
      port: z.object({
        num: z.number(),
        name: z.string().nullable(),
        descr: z.string().nullable(),
      }),
    }),
    target: z.object({
      id: z.number().nullable(),
      name: z.string().nullable(),
      port: z.object({
        id: z.string().nullable(),
        descr: z.string().nullable(),
      }),
    }),
    protocol: z.string().openapi({ example: 'LLDP' }),
  }),
);

export const getSwitchConnectionsQuerySchema = z.object({
  format: z
    .enum(['json', 'simple', 'mermaid'])
    .optional()
    .default('json')
    .openapi({
      param: {
        name: 'format',
        in: 'query',
      },
      description:
        'Format of the response. "mermaid" returns a Mermaid.js graph string.',
    }),
});
