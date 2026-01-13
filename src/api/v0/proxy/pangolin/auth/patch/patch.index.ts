import { OpenAPIHono } from '@hono/zod-openapi';
import { patchPangolinAuthRoute } from './patch.route';
import { patchPangolinAuthHandler } from './patch.handler';

const patchPangolinAuthRouter = new OpenAPIHono();

patchPangolinAuthRouter.openapi(
  patchPangolinAuthRoute,
  patchPangolinAuthHandler,
);

export default patchPangolinAuthRouter;
