import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';
import listRouter from './list/list.index';
import getRouter from './get/get.index';
import patchRouter from './patch/patch.index';
import deleteRouter from './delete/delete.index';
import assignRouter from './assign/assign.index';

const tagRouter = new OpenAPIHono();

tagRouter.route('/', postRouter);
tagRouter.route('/', listRouter);
tagRouter.route('/', getRouter);
tagRouter.route('/', patchRouter);
tagRouter.route('/', deleteRouter);
tagRouter.route('/', assignRouter);

export default tagRouter;
