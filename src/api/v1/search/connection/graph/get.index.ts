import { OpenAPIHono } from '@hono/zod-openapi';
import { getSwitchConnectionsRoute } from './get.route';
import { getSwitchConnectionsHandler } from './get.handler';

const switchGraphRouter = new OpenAPIHono();

switchGraphRouter.openapi(
  getSwitchConnectionsRoute,
  getSwitchConnectionsHandler,
);

export default switchGraphRouter;
