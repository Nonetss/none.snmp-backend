import { OpenAPIHono } from '@hono/zod-openapi';
import { getServiceSearchRoute } from './list.route';
import { getServiceSearchHandler } from './list.handler';

const getServiceSearchRouter = new OpenAPIHono();
getServiceSearchRouter.openapi(getServiceSearchRoute, getServiceSearchHandler);
export default getServiceSearchRouter;
