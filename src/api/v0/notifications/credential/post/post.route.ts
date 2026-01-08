import { createRoute } from '@hono/zod-openapi';
import {
  NtfyCredentialSchema,
  CreateNtfyCredentialSchema,
} from '@/api/v0/notifications/credential/credential.schema';

export const postNtfyCredentialRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create ntfy credential',
  tags: ['Notifications Credential'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateNtfyCredentialSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: NtfyCredentialSchema,
        },
      },
      description: 'Credential created',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
