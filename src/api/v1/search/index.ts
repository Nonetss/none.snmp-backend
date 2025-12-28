import { OpenAPIHono } from '@hono/zod-openapi';
import connectionRouter from './connection/get.index';

const searchRouter = new OpenAPIHono();

searchRouter.route('/', connectionRouter);

export default searchRouter;
