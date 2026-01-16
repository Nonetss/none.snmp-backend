import { z } from '@hono/zod-openapi';
import { npmGetResponseSchema } from '@/api/v0/proxy/npm/get/get.schema';
import { pangolinGetResponseSchema } from '@/api/v0/proxy/pangolin/get/get.schema';

export const bothGetResponseSchema = z
  .object({
    npm: npmGetResponseSchema,
    pangolin: pangolinGetResponseSchema,
  })
  .openapi({
    example: {
      npm: {
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
      pangolin: {
        response: [
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
        metadata: {
          exists: true,
          npm: {
            exists: true,
            total_org: 1,
          },
          pangolin: {
            exists: true,
            total_org: 1,
          },
          total_resources: 214,
        },
      },
    },
  });
