import { OpenAPIHono } from '@hono/zod-openapi';
import interfaceGetRouter from './get/get.index';
const interfaceRouter = new OpenAPIHono();
interfaceRouter.route('/', interfaceGetRouter);
export default interfaceRouter;
