import { OpenAPIHono } from '@hono/zod-openapi';
import resourceGetRouter from './get/get.index';
import resourceListRouter from './list/list.index';
const resourceRouter = new OpenAPIHono();
resourceRouter.route('/', resourceListRouter);
resourceRouter.route('/', resourceGetRouter);
export default resourceRouter;
