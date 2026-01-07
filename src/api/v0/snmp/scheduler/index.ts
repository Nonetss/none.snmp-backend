import { OpenAPIHono } from '@hono/zod-openapi';
import listRouter from './list/list.index';
import postRouter from './post/post.index';
import patchRouter from './patch/patch.index';
import deleteRouter from './delete/delete.index';

const schedulerRouter = new OpenAPIHono();

schedulerRouter.route('/', listRouter);
schedulerRouter.route('/', postRouter);
schedulerRouter.route('/', patchRouter);
schedulerRouter.route('/', deleteRouter);

export default schedulerRouter;
