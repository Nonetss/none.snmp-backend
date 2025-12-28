import { OpenAPIHono } from '@hono/zod-openapi';
import listRouter from './list/list.index';
import deleteRouter from './delete/delete.index';
import pollInterfacesRouter from './interfaces/poll/post.index';
import pollResourcesRouter from './resources/poll/post.index';
import pollIpRouter from './poll/ip/post.index';
import pollSystemRouter from './poll/system/post.index';
import pollAllRouter from './poll/all/post.index';
import getDeviceInterfacesRouter from './interfaces/get/get.index';
import getDeviceResourcesRouter from './resources/get/get.index';

const deviceRouter = new OpenAPIHono();

deviceRouter.route('/', listRouter);
deviceRouter.route('/', deleteRouter);
deviceRouter.route('/', getDeviceResourcesRouter);
deviceRouter.route('/', getDeviceInterfacesRouter);
deviceRouter.route('/poll', pollInterfacesRouter);
deviceRouter.route('/poll', pollResourcesRouter);
deviceRouter.route('/poll', pollIpRouter);
deviceRouter.route('/poll', pollSystemRouter);
deviceRouter.route('/poll', pollAllRouter);

export default deviceRouter;
