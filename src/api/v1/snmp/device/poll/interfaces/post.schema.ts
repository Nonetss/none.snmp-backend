import { z } from '@hono/zod-openapi';

export const postPollInterfacesSchema = z.object({
  message: z.string().openapi({ example: 'Interface polling started' }),
  status: z.string().openapi({ example: 'success' }),
});
