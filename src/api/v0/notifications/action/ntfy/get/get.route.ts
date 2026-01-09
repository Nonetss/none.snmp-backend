import { createRoute } from '@hono/zod-openapi';
import { NtfyActionSchema, NtfyActionIdParamSchema } from '../../action.schema';

export const getNtfyActionRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get ntfy configuration by ID',
  tags: ['Notifications Action'],
  request: {
    params: NtfyActionIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: NtfyActionSchema,
        },
      },
      description: 'Ntfy configuration',
    },
    404: {
      description: 'Ntfy action not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
