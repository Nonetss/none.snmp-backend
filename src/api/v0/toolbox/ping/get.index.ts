import { OpenAPIHono } from '@hono/zod-openapi';
import { getPingRoute } from './get.route';
import { getPingHandler } from './get.handler';

const getPingRouter = new OpenAPIHono();

getPingRouter.openapi(getPingRoute, getPingHandler);

export default getPingRouter;
