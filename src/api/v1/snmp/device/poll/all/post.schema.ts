import { z } from '@hono/zod-openapi';

export const postPollAllSchema = z.object({
  message: z.string().openapi({ example: 'Complete device polling completed' }),
  status: z.string().openapi({ example: 'success' }),
});
