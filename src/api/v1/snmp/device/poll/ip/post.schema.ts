import { z } from '@hono/zod-openapi';

export const postPollIpSchema = z.object({
  message: z.string().openapi({ example: 'IP polling started' }),
  status: z.string().openapi({ example: 'success' }),
});
