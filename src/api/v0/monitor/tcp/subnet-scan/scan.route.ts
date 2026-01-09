import { createRoute } from '@hono/zod-openapi';
import {
  SubnetPortScanSchema,
  SubnetPortScanResponseSchema,
} from '../tcp.schema';

export const postSubnetPortScanRoute = createRoute({
  method: 'post',
  path: '/subnet-scan',
  summary: 'Perform a multi-port TCP scan on a subnet',
  tags: ['Monitor', 'TCP'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: SubnetPortScanSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubnetPortScanResponseSchema,
        },
      },
      description: 'Subnet scan results',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
