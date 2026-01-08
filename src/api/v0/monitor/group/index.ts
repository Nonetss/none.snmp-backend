import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';
import listRouter from './list/list.index';
import getRouter from './get/get.index';
import patchRouter from './patch/patch.index';
import deleteRouter from './delete/delete.index';

const groupRouter = new OpenAPIHono();

groupRouter.route('/', postRouter);
groupRouter.route('/', listRouter);
groupRouter.route('/', getRouter);
groupRouter.route('/', patchRouter);
groupRouter.route('/', deleteRouter);

export default groupRouter;
