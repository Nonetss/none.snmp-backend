import { OpenAPIHono } from '@hono/zod-openapi';
import connectionSearchRouter from './get/get.index';

const connectionRouter = new OpenAPIHono();

connectionRouter.route('/', connectionSearchRouter);

export default connectionRouter;
