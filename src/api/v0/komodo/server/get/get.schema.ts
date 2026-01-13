import { z } from '@hono/zod-openapi';

export const getKomodoServersResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    state: z.string(),
    version: z.string(),
  }),
);
