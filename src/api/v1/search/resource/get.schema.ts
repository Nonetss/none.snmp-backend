import { z } from '@hono/zod-openapi';

export const resourceSearchQuerySchema = z.object({
  name: z.string().openapi({
    description: 'Name of the resource (installed software) to search for',
    example: 'nginx',
  }),
  installed: z.enum(['true', 'false']).default('true').openapi({
    description:
      'Filter devices where the resource is installed (true) or missing (false)',
    example: 'true',
  }),
});

export const resourceSearchResultSchema = z.object({
  id: z.number(),
  ipv4: z.string(),
  name: z.string().nullable(),
});

export const getResourceSearchResponseSchema = z.array(
  resourceSearchResultSchema,
);
