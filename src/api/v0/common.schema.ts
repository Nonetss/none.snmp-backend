import { z } from '@hono/zod-openapi';

/**
 * Common query parameter for Excel export.
 */
export const ExcelQuerySchema = z.object({
  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
});
