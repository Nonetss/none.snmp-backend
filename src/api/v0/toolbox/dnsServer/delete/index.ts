import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteDnsServerRoute } from './delete.route';
import { deleteDnsServerHandler } from './delete.handler';

const deleteDnsServerRouter = new OpenAPIHono();

deleteDnsServerRouter.openapi(deleteDnsServerRoute, deleteDnsServerHandler);

export default deleteDnsServerRouter;
