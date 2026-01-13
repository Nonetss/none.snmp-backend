import { OpenAPIHono } from '@hono/zod-openapi';
import { getPangolinAuthRoute } from './get.route';
import { getPangolinAuthHandler } from './get.handler';

const getPangolinAuthRouter = new OpenAPIHono();

getPangolinAuthRouter.openapi(getPangolinAuthRoute, getPangolinAuthHandler);

export default getPangolinAuthRouter;
