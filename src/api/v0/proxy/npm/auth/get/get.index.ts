import { OpenAPIHono } from '@hono/zod-openapi';
import { getNpmAuthRoute } from './get.route';
import { getNpmAuthHandler } from './get.handler';

const getNpmAuthRouter = new OpenAPIHono();

getNpmAuthRouter.openapi(getNpmAuthRoute, getNpmAuthHandler);

export default getNpmAuthRouter;
