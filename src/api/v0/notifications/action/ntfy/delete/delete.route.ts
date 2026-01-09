import { createRoute, z } from '@hono/zod-openapi';
import { NtfyActionIdParamSchema } from '../../action.schema';

export const deleteNtfyActionRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete ntfy configuration',
  tags: ['Notifications Action'],
  request: {
    params: NtfyActionIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Ntfy configuration deleted',
    },
    404: {
      description: 'Ntfy action not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
