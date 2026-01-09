import { createRoute } from '@hono/zod-openapi';
import {
  NtfyActionSchema,
  UpdateNtfyActionSchema,
  NtfyActionIdParamSchema,
} from '../../action.schema';

export const patchNtfyActionRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update ntfy configuration',
  tags: ['Notifications Action'],
  request: {
    params: NtfyActionIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateNtfyActionSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: NtfyActionSchema,
        },
      },
      description: 'Ntfy configuration updated',
    },
    404: {
      description: 'Ntfy action not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
