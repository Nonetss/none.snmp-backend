import { createRoute } from '@hono/zod-openapi';
import {
  NtfyCredentialSchema,
  NtfyCredentialIdParamSchema,
} from '@/api/v0/notifications/credential/credential.schema';

export const getNtfyCredentialRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get ntfy credential by ID',
  tags: ['Notifications Credential'],
  request: {
    params: NtfyCredentialIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: NtfyCredentialSchema,
        },
      },
      description: 'Credential found',
    },
    404: {
      description: 'Credential not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
