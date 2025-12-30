import { z } from '@hono/zod-openapi';

export const PostAuthSchema = z.object({
  version: z.enum(['v1', 'v2c', 'v3']).openapi({ example: 'v3' }),
  port: z.number().default(161).openapi({ example: 161 }),
  community: z.string().openapi({ example: 'public' }),
  v3User: z.string().optional().openapi({ example: 'nonemonitor' }),
  v3AuthProtocol: z.enum(['md5', 'sha']).optional().openapi({ example: 'sha' }),
  v3AuthKey: z.string().optional().openapi({ example: 'authKey123' }),
  v3PrivProtocol: z.enum(['aes', 'des']).optional().openapi({ example: 'aes' }),
  v3PrivKey: z.string().optional().openapi({ example: 'privKey123' }),
  v3Level: z
    .enum(['noAuthNoPriv', 'authNoPriv', 'authPriv'])
    .optional()
    .openapi({ example: 'authPriv' }),
});

export const PostAuthResponseSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  message: z
    .string()
    .openapi({ example: 'Authentication created successfully' }),
});
