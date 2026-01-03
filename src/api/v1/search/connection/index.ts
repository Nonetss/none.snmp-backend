import { OpenAPIHono } from '@hono/zod-openapi';
import connectionSearchRouter from './get/get.index';
import connectionGraphRouter from './graph/get.index';

const connectionRouter = new OpenAPIHono();

connectionRouter.route('/', connectionSearchRouter);
connectionRouter.route('/', connectionGraphRouter);

export default connectionRouter;
