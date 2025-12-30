import { OpenAPIHono } from '@hono/zod-openapi';
import { getConnectionSearchRoute } from './get.route';
import { getConnectionSearchHandler } from './get.handler';

const connectionSearchRouter = new OpenAPIHono();

connectionSearchRouter.openapi(
  getConnectionSearchRoute,
  getConnectionSearchHandler,
);

export default connectionSearchRouter;
