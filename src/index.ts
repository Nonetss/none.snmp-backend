import { Scalar } from '@scalar/hono-api-reference';
import { z, createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { Handler } from 'hono';

const app = new OpenAPIHono();

app.use('*', cors());

const rootSchema = z.object({
  message: z.string().openapi({ example: 'Hello, World!' }),
});

const rootRoute = createRoute({
  method: 'get',
  path: '',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: rootSchema,
        },
      },
      description: 'Root endpoint',
    },
  },
});

const rootHandler: Handler = (c) => {
  return c.json({ message: 'Hello, World!' });
};

app.openapi(rootRoute, rootHandler);

import apiRouter from './api';
app.route('/api', apiRouter);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
});

app.get('/scalar', Scalar({ url: '/doc' }));

Bun.serve({
  port: 3000,
  fetch: app.fetch,
});
