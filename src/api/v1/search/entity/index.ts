import { OpenAPIHono } from '@hono/zod-openapi';
import entityGetRouter from './get/get.index';
const entityRouter = new OpenAPIHono();
entityRouter.route('/', entityGetRouter);
export default entityRouter;
