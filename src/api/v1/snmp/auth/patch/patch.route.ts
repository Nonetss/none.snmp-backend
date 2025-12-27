import { createRoute } from '@hono/zod-openapi';
import {
  PatchAuthParamsSchema,
  PatchAuthBodySchema,
  PatchAuthResponseSchema,
} from './patch.schema';

export const patchAuthRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update SNMP authentication',
  description:
    'Updates an existing SNMP authentication configuration with the provided data.',
  request: {
    params: PatchAuthParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: PatchAuthBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PatchAuthResponseSchema,
        },
      },
      description: 'Authentication updated successfully',
    },
    404: {
      description: 'Authentication not found',
    },
  },
  tags: ['SNMP Authentication'],
});
