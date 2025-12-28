import { z } from '@hono/zod-openapi';

export const postPollSystemSchema = z.object({
  message: z.string().openapi({ example: 'System info polling started' }),
  status: z.string().openapi({ example: 'success' }),
});
