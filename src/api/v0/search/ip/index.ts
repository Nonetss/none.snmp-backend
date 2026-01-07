import { OpenAPIHono } from '@hono/zod-openapi';
import ipGetRouter from './get/get.index';
const ipRouter = new OpenAPIHono();
ipRouter.route('/', ipGetRouter);
export default ipRouter;
