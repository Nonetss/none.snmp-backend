import { OpenAPIHono } from '@hono/zod-openapi';
import { getConnectionGraphRoute } from './get.route';
import { getConnectionGraphHandler } from './get.handler';

const connectionGraphRouter = new OpenAPIHono();

connectionGraphRouter.openapi(
  getConnectionGraphRoute,
  getConnectionGraphHandler,
);

export default connectionGraphRouter;
