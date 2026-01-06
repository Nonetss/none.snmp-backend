import { OpenAPIHono } from '@hono/zod-openapi';
import deviceGetRouter from './get/get.index';
import deviceListRouter from './list/list.index';
import deviceAllRouter from './all/get/get.index';

const deviceRouter = new OpenAPIHono();

deviceRouter.route('/list', deviceListRouter);
deviceRouter.route('/', deviceAllRouter);
deviceRouter.route('/', deviceGetRouter);

export default deviceRouter;
