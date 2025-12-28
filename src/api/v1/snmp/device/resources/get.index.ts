import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceResourcesRoute } from './get.route';
import { getDeviceResourcesHandler } from './get.handler';

const getDeviceResourcesRouter = new OpenAPIHono();

getDeviceResourcesRouter.openapi(
  getDeviceResourcesRoute,
  getDeviceResourcesHandler,
);

export default getDeviceResourcesRouter;
