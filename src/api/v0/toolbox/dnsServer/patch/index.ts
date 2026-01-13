import { OpenAPIHono } from '@hono/zod-openapi';
import { patchDnsServerRoute } from './patch.route';
import { patchDnsServerHandler } from './patch.handler';

const patchDnsServerRouter = new OpenAPIHono();

patchDnsServerRouter.openapi(patchDnsServerRoute, patchDnsServerHandler);

export default patchDnsServerRouter;
