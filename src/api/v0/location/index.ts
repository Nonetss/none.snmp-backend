import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';
import listRouter from './list/list.index';
import getRouter from './get/get.index';
import patchRouter from './patch/patch.index';
import deleteRouter from './delete/delete.index';
import assignRouter from './assign/assign.index';

const locationRouter = new OpenAPIHono();

locationRouter.route('/', postRouter);
locationRouter.route('/', listRouter);
locationRouter.route('/', getRouter);
locationRouter.route('/', patchRouter);
locationRouter.route('/', deleteRouter);
locationRouter.route('/', assignRouter);

export default locationRouter;
