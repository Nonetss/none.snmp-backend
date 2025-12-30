import { OpenAPIHono } from '@hono/zod-openapi';
import { getConnectionSearchRoute } from './get.route';
import { getConnectionSearchHandler } from './get.handler';
import switchGraphRouter from './graph/switch/get.index';

const connectionSearchRouter = new OpenAPIHono();

connectionSearchRouter.openapi(
  getConnectionSearchRoute,
  getConnectionSearchHandler,
);

connectionSearchRouter.route('/', switchGraphRouter);

export default connectionSearchRouter;
