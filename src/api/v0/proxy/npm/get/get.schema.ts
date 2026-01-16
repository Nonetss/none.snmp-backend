import { z } from '@hono/zod-openapi';

const metaSchema = z.object({
  letsencrypt_agree: z.boolean(),
  dns_challenge: z.boolean(),
  nginx_online: z.boolean(),
  nginx_err: z.string().nullable(),
});

export const npmGetResponseSchema = z
  .object({
    response: z.array(
      z.object({
        url: z.string(),
        resource: z.array(
          z.object({
            id: z.number(),
            created_on: z.string(),
            modified_on: z.string(),
            owner_user_id: z.number(),
            domain_names: z.array(z.string()),
            forward_host: z.string(),
            forward_port: z.number(),
            access_list_id: z.number(),
            certificate_id: z.number(),
            ssl_forced: z.boolean(),
            caching_enabled: z.boolean(),
            block_exploits: z.boolean(),
            advanced_config: z.string(),
            meta: metaSchema,
          }),
        ),
      }),
    ),
    metadata: z.object({
      exists: z.boolean(),
      total: z.number(),
    }),
  })
  .openapi({
    example: {
      response: [
        {
          url: 'https://npm.example.com',
          resource: [
            {
              id: 100,
              created_on: '2025-06-11 13:31:00',
              modified_on: '2025-06-11 13:31:01',
              owner_user_id: 1,
              domain_names: ['proxy.domain.example'],
              forward_host: '192.168.1.100',
              forward_port: 8558,
              access_list_id: 0,
              certificate_id: 2,
              ssl_forced: true,
              caching_enabled: true,
              block_exploits: true,
              advanced_config: '',
              meta: {
                letsencrypt_agree: false,
                dns_challenge: false,
                nginx_online: true,
                nginx_err: null,
              },
            },
          ],
        },
      ],
      metadata: {
        exists: true,
        total: 1,
      },
    },
  });
