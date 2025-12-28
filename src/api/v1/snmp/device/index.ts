import { OpenAPIHono } from '@hono/zod-openapi';
import listRouter from './list/list.index';
import deleteRouter from './delete/delete.index';
import pollInterfacesRouter from './poll/interfaces/post.index';
import pollResourcesRouter from './poll/resources/post.index';
import pollIpRouter from './poll/ip/post.index';
import pollSystemRouter from './poll/system/post.index';

const deviceRouter = new OpenAPIHono();

deviceRouter.route('/', listRouter);
deviceRouter.route('/', deleteRouter);
deviceRouter.route('/poll', pollInterfacesRouter);
deviceRouter.route('/poll', pollResourcesRouter);
deviceRouter.route('/poll', pollIpRouter);
deviceRouter.route('/poll', pollSystemRouter);

export default deviceRouter;
