import { OpenAPIHono } from '@hono/zod-openapi';
import { getResourceSearchRoute } from './get.route';
import { getResourceSearchHandler } from './get.handler';

const getResourceSearchRouter = new OpenAPIHono();
getResourceSearchRouter.openapi(
  getResourceSearchRoute,
  getResourceSearchHandler,
);
export default getResourceSearchRouter;
