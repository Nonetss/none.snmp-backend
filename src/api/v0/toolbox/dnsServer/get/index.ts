import { OpenAPIHono } from '@hono/zod-openapi';
import { getDnsServerRoute } from './get.route';
import { getDnsServerHandler } from './get.handler';

const getDnsServerRouter = new OpenAPIHono();

getDnsServerRouter.openapi(getDnsServerRoute, getDnsServerHandler);

export default getDnsServerRouter;
