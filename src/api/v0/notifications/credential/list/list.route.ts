import { createRoute, z } from '@hono/zod-openapi';
import { NtfyCredentialSchema } from '../credential.schema';

export const listNtfyCredentialRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List ntfy credentials',
  tags: ['Notifications Credential'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(NtfyCredentialSchema),
        },
      },
      description: 'List of credentials',
    },
    500: {
      description: 'Internal Server Error',
    },
  },
});
