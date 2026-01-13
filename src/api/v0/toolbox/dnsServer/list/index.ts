import { OpenAPIHono } from '@hono/zod-openapi';
import { listDnsServerRoute } from './list.route';
import { listDnsServerHandler } from './list.handler';

const listDnsServerRouter = new OpenAPIHono();

listDnsServerRouter.openapi(listDnsServerRoute, listDnsServerHandler);

export default listDnsServerRouter;
