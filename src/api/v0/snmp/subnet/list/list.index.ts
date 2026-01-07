import { OpenAPIHono } from '@hono/zod-openapi';
import { listSubnetRoute } from './list.route';
import { listSubnetHandler } from './list.handler';

const listSubnetRouter = new OpenAPIHono();

listSubnetRouter.openapi(listSubnetRoute, listSubnetHandler);

export default listSubnetRouter;
