import { OpenAPIHono } from '@hono/zod-openapi';
import switchGraphRouter from './graph/get.index';
import connectionSearchRouter from './get/get.index';

const connectionRouter = new OpenAPIHono();

connectionRouter.route('/', switchGraphRouter);
connectionRouter.route('/', connectionSearchRouter);

export default connectionRouter;
