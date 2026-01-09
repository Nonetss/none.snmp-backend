import { OpenAPIHono } from '@hono/zod-openapi';
import listRouter from './list/index';
import postRouter from './post/index';
import patchRouter from './patch/index';
import deleteRouter from './delete/index';
import ntfyRouter from './ntfy/index';

const actionRouter = new OpenAPIHono();

actionRouter.route('/ntfy', ntfyRouter);
actionRouter.route('/', listRouter);
actionRouter.route('/', postRouter);
actionRouter.route('/', patchRouter);
actionRouter.route('/', deleteRouter);

export default actionRouter;
