import { z } from '@hono/zod-openapi';

export const getLoginHistoryQuerySchema = z.object({
  name: z.string().optional().openapi({ example: 'DESKTOP-ABC' }),
  ip: z.string().optional().openapi({ example: '172.19.3.17' }),
});

export const getLoginHistoryResponseSchema = z.object({
  computerName: z.string().nullable(),
  history: z.array(
    z.object({
      username: z.string().nullable(),
      loginTime: z.string().nullable(),
    }),
  ),
});
