import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceRouteRoute } from './get.route';
import { getDeviceRouteHandler } from './get.handler';

const getDeviceRouteRouter = new OpenAPIHono();

getDeviceRouteRouter.openapi(getDeviceRouteRoute, getDeviceRouteHandler);

export default getDeviceRouteRouter;
