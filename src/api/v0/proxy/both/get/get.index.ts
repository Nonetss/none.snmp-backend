import { OpenAPIHono } from '@hono/zod-openapi';
import { bothGetRoute } from './get.route';
import { bothGetHandler } from './get.handler';

const bothGetRouter = new OpenAPIHono();

bothGetRouter.openapi(bothGetRoute, bothGetHandler);

export default bothGetRouter;
