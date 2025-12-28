import { z } from '@hono/zod-openapi';

export const serviceSearchQuerySchema = z.object({
  name: z.string().openapi({
    description: 'Name of the service (running process) to search for',
    example: 'snmpd',
  }),
  running: z.enum(['true', 'false']).default('true').openapi({
    description:
      'Filter devices where the service is running (true) or missing (false)',
    example: 'true',
  }),
});

export const serviceSearchResultSchema = z.object({
  id: z.number(),
  ipv4: z.string(),
  name: z.string().nullable(),
});

export const getServiceSearchResponseSchema = z.array(
  serviceSearchResultSchema,
);
