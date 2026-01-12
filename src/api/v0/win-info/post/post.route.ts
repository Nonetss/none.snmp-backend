import { createRoute } from '@hono/zod-openapi';
import { postResponseSchema, PostDataSchema } from './post.schema';

export const postRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['WinInfo'],
  summary: 'Record Windows information',
  description:
    'Ingest and store detailed system information from a Windows machine. Only stores one set of data per day per computer, updating if multiple requests are sent.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: PostDataSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: postResponseSchema,
        },
      },
      description: 'System information successfully recorded',
    },
  },
});
