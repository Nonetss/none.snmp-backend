import { OpenAPIHono } from '@hono/zod-openapi';
import { getTracerouteRoute } from './get.route';
import { getTracerouteHandler } from './get.handler';

const getTracerouteRouter = new OpenAPIHono();

getTracerouteRouter.openapi(getTracerouteRoute, getTracerouteHandler);

export default getTracerouteRouter;
