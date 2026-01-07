import { OpenAPIHono } from '@hono/zod-openapi';
import { getResourceSearchRoute } from './list.route';
import { getResourceSearchHandler } from './list.handler';

const getResourceSearchRouter = new OpenAPIHono();
getResourceSearchRouter.openapi(
  getResourceSearchRoute,
  getResourceSearchHandler,
);
export default getResourceSearchRouter;
