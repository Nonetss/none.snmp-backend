import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceInterfacesRoute } from './get.route';
import { getDeviceInterfacesHandler } from './get.handler';

const getDeviceInterfacesRouter = new OpenAPIHono();

getDeviceInterfacesRouter.openapi(
  getDeviceInterfacesRoute,
  getDeviceInterfacesHandler,
);

export default getDeviceInterfacesRouter;
