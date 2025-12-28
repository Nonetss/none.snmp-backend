import { z } from '@hono/zod-openapi';

export const postPollResourcesSchema = z.object({
  message: z.string().openapi({ example: 'Resource polling started' }),
  status: z.string().openapi({ example: 'success' }),
});
