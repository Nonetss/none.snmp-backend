import { OpenAPIHono } from '@hono/zod-openapi';
import cdpGetRouter from './get/get.index';
const cdpRouter = new OpenAPIHono();
cdpRouter.route('/', cdpGetRouter);
export default cdpRouter;
