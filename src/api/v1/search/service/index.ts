import { OpenAPIHono } from '@hono/zod-openapi';
import serviceGetRouter from './get/get.index';
import serviceListRouter from './list/list.index';
const serviceRouter = new OpenAPIHono();
serviceRouter.route('/', serviceListRouter);
serviceRouter.route('/', serviceGetRouter);
export default serviceRouter;
