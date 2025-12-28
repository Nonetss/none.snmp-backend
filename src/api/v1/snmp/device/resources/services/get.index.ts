import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceServicesRoute } from './get.route';
import { getDeviceServicesHandler } from './get.handler';

const getDeviceServicesRouter = new OpenAPIHono();
getDeviceServicesRouter.openapi(
  getDeviceServicesRoute,
  getDeviceServicesHandler,
);
export default getDeviceServicesRouter;
