import { z } from '@hono/zod-openapi';

export const getApplicationNamesQuerySchema = z.object({
  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
});

export const getApplicationNamesResponseSchema = z.array(z.string());
