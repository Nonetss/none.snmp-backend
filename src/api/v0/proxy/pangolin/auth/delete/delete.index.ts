import { OpenAPIHono } from '@hono/zod-openapi';
import { deletePangolinAuthRoute } from './delete.route';
import { deletePangolinAuthHandler } from './delete.handler';

const deletePangolinAuthRouter = new OpenAPIHono();

deletePangolinAuthRouter.openapi(
  deletePangolinAuthRoute,
  deletePangolinAuthHandler,
);

export default deletePangolinAuthRouter;
