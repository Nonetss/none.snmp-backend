import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';
import listRouter from './list/list.index';
import getRouter from './get/get.index';
import patchRouter from './patch/patch.index';
import deleteRouter from './delete/delete.index';

const authRouter = new OpenAPIHono();

authRouter.route('/', postRouter);
authRouter.route('/', listRouter);
authRouter.route('/', getRouter);
authRouter.route('/', patchRouter);
authRouter.route('/', deleteRouter);

export default authRouter;
