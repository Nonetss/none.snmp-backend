import { OpenAPIHono } from '@hono/zod-openapi';
import deviceGetRouter from './get/get.index';
import deviceListRouter from './list/list.index';
import deviceStatusRouter from './status/status.index';
import deviceAllRouter from './all/get/get.index';
import identifyRouter from './identify/identify.index';
import locationRouter from './location/index';

const deviceRouter = new OpenAPIHono();

deviceRouter.route('/list', deviceListRouter);
deviceRouter.route('/status', deviceStatusRouter);
deviceRouter.route('/location', locationRouter);
deviceRouter.route('/', identifyRouter);
deviceRouter.route('/', deviceAllRouter);
deviceRouter.route('/', deviceGetRouter);

export default deviceRouter;
