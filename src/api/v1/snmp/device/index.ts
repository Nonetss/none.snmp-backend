import { OpenAPIHono } from '@hono/zod-openapi';
import listRouter from './list/list.index';
import deleteRouter from './delete/delete.index';

// Interfaces
import pollInterfacesRouter from './interfaces/poll/post.index';
import getDeviceInterfacesRouter from './interfaces/get/get.index';

// Resources
import pollResourcesRouter from './resources/poll/post.index';
import getDeviceResourcesRouter from './resources/get/get.index';

// IP
import pollIpRouter from './ip/poll/post.index';
import getDeviceIpRouter from './ip/get/get.index';

// System
import pollSystemRouter from './system/poll/post.index';
import getDeviceSystemRouter from './system/get/get.index';

// All
import pollAllRouter from './all/poll/post.index';
import getDeviceAllRouter from './all/get/get.index';

const deviceRouter = new OpenAPIHono();

// Base routes
deviceRouter.route('/', listRouter);
deviceRouter.route('/', deleteRouter);

// Inventory routes (GET)
deviceRouter.route('/', getDeviceInterfacesRouter);
deviceRouter.route('/', getDeviceResourcesRouter);
deviceRouter.route('/', getDeviceIpRouter);
deviceRouter.route('/', getDeviceSystemRouter);
deviceRouter.route('/', getDeviceAllRouter);

// Polling routes (POST)
deviceRouter.route('/poll', pollInterfacesRouter);
deviceRouter.route('/poll', pollResourcesRouter);
deviceRouter.route('/poll', pollIpRouter);
deviceRouter.route('/poll', pollSystemRouter);
deviceRouter.route('/poll', pollAllRouter);

export default deviceRouter;
