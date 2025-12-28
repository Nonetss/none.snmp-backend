import { OpenAPIHono } from '@hono/zod-openapi';
import listRouter from './list/list.index';
import deleteRouter from './delete/delete.index';
import pollInterfacesRouter from './poll/interfaces/post.index';
import pollResourcesRouter from './poll/resources/post.index';

const deviceRouter = new OpenAPIHono();

deviceRouter.route('/', listRouter);
deviceRouter.route('/', deleteRouter);
deviceRouter.route('/poll', pollInterfacesRouter);
deviceRouter.route('/poll', pollResourcesRouter);

export default deviceRouter;
