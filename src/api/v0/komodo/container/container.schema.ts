import { z } from '@hono/zod-openapi';

export const containerItemSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  serverId: z.string().optional(),
  image: z.string().optional(),
  state: z.string(),
  status: z.string().optional(),
});

export const containerListResponseSchema = z.array(containerItemSchema);
