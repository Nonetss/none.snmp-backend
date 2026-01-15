import { z } from '@hono/zod-openapi';

const targetSchema = z.object({
  targetId: z.number(),
  ip: z.string(),
  port: z.number(),
  enabled: z.boolean(),
  healthStatus: z.string(),
});

export const pangolinGetResponseSchema = z.object({
  response: z
    .array(
      z.object({
        resourceId: z.number(),
        niceId: z.string(),
        name: z.string(),
        ssl: z.boolean(),
        fullDomain: z.string(),
        passwordId: z.number().nullable(),
        sso: z.boolean(),
        pincodeId: z.number().nullable(),
        whitelist: z.boolean(),
        http: z.boolean(),
        protocol: z.string(),
        proxyPort: z.number().nullable(),
        enabled: z.boolean(),
        domainId: z.string(),
        headerAuthId: z.number().nullable(),
        targets: z.array(targetSchema),
      }),
    )
    .openapi({
      example: [
        {
          resourceId: 1,
          niceId: 'incompatible-mexican-mole-lizard',
          name: 'proxy',
          ssl: true,
          fullDomain: 'proxy.domain.example',
          passwordId: null,
          sso: false,
          pincodeId: null,
          whitelist: false,
          http: true,
          protocol: 'tcp',
          proxyPort: null,
          enabled: true,
          domainId: 'domain1',
          headerAuthId: null,
          targets: [
            {
              targetId: 1,
              ip: '192.168.1.100',
              port: 8123,
              enabled: true,
              healthStatus: 'unknown',
            },
            {
              targetId: 161,
              ip: '192.168.1.100',
              port: 8123,
              enabled: true,
              healthStatus: 'healthy',
            },
          ],
        },
        {
          resourceId: 2,
          niceId: 'close-steppe-pika',
          name: 'netbox',
          ssl: true,
          fullDomain: 'proxy.domain.example',
          passwordId: null,
          sso: false,
          pincodeId: null,
          whitelist: false,
          http: true,
          protocol: 'tcp',
          proxyPort: null,
          enabled: true,
          domainId: 'domain1',
          headerAuthId: null,
          targets: [
            {
              targetId: 90,
              ip: '192.168.1.100',
              port: 443,
              enabled: true,
              healthStatus: 'healthy',
            },
          ],
        },
      ],
    }),
  metadata: z.object({
    exists: z.boolean(),
    total_org: z.number(),
  }),
});
