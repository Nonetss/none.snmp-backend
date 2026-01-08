import { createRoute } from '@hono/zod-openapi';
import {
  NtfyCredentialSchema,
  NtfyCredentialIdParamSchema,
  UpdateNtfyCredentialSchema,
} from '@/api/v0/notifications/credential/credential.schema';

export const patchNtfyCredentialRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update ntfy credential',
  tags: ['Notifications Credential'],
  request: {
    params: NtfyCredentialIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateNtfyCredentialSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: NtfyCredentialSchema,
        },
      },
      description: 'Credential updated',
    },
    404: {
      description: 'Credential not found',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
