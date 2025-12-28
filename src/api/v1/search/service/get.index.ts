import { OpenAPIHono } from '@hono/zod-openapi';
import { getServiceSearchRoute } from './get.route';
import { getServiceSearchHandler } from './get.handler';

const getServiceSearchRouter = new OpenAPIHono();
getServiceSearchRouter.openapi(getServiceSearchRoute, getServiceSearchHandler);
export default getServiceSearchRouter;
