import { createRoute, z } from '@hono/zod-openapi';
import { NtfyCredentialIdParamSchema } from '@/api/v0/notifications/credential/credential.schema';

export const deleteNtfyCredentialRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete ntfy credential',
  tags: ['Notifications Credential'],
  request: {
    params: NtfyCredentialIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
      description: 'Credential deleted',
    },
    404: {
      description: 'Credential not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
