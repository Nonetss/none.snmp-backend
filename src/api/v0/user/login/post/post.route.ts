import { createRoute } from '@hono/zod-openapi';
import { postLoginSchema, postLoginResponseSchema } from './post.schema';

export const postLoginRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Users'],
  summary: 'Register a user login',
  description:
    "Records a login event for a user on a specific computer. Creates the user if it doesn't exist.",
  request: {
    body: {
      content: {
        'application/json': {
          schema: postLoginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: postLoginResponseSchema,
        },
      },
      description: 'Login successfully recorded',
    },
    404: {
      description: 'Computer not found',
    },
  },
});
