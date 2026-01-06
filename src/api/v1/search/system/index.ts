import { OpenAPIHono } from '@hono/zod-openapi';
import systemGetRouter from './get/get.index';
const systemRouter = new OpenAPIHono();
systemRouter.route('/', systemGetRouter);
export default systemRouter;
