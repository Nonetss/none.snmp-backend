import { OpenAPIHono } from '@hono/zod-openapi';
import { npmGetRoute } from './get.route';
import { npmGetHandler } from './get.handler';

const npmGetRouter = new OpenAPIHono();

npmGetRouter.openapi(npmGetRoute, npmGetHandler);

export default npmGetRouter;
