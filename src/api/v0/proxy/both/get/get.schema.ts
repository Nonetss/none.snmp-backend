import { z } from '@hono/zod-openapi';
import { npmGetResponseSchema } from '@/api/v0/proxy/npm/get.schema';
import { pangolinGetResponseSchema } from '@/api/v0/proxy/pangolin/get/get.schema';

export const bothGetResponseSchema = z
  .object({
    npm: npmGetResponseSchema,
    pangolin: pangolinGetResponseSchema,
  })
  .openapi({
    example: {
      npm: {
        response: [],
        metadata: {
          exists: false,
          total: 0,
        },
      },
      pangolin: {
        response: [],
        metadata: {
          exists: false,
          total: 0,
        },
      },
    },
  });
