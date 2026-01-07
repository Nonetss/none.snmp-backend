import { createRoute } from '@hono/zod-openapi';
import { ScanAllResponseSchema } from './all.schema';

export const postScanAllRoute = createRoute({
  method: 'post',
  path: '/all',
  summary: 'Rescan all subnets',
  description: 'Triggers a full SNMP scan for all defined subnets.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ScanAllResponseSchema,
        },
      },
      description: 'Scan results for all subnets',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
  tags: ['SNMP Scan'],
});
