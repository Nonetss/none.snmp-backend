import { OpenAPIHono } from '@hono/zod-openapi';
import getRouter from './get/get.index';

const subnetLocationRouter = new OpenAPIHono();

subnetLocationRouter.route('/', getRouter);

export default subnetLocationRouter;
