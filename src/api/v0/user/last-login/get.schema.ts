import { z } from '@hono/zod-openapi';

export const getLastLoginQuerySchema = z.object({
  name: z.string().optional().openapi({ example: 'DESKTOP-ABC' }),
  ip: z.string().optional().openapi({ example: '172.19.3.17' }),
  excel: z.enum(['true', 'false']).optional().default('false').openapi({
    description: 'If true, returns the data as an Excel file instead of JSON',
    example: 'false',
  }),
});

export const getLastLoginResponseSchema = z.object({
  computerName: z.string().nullable(),
  username: z.string().nullable(),
  loginTime: z.string().nullable(),
});
