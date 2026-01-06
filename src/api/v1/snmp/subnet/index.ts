import { OpenAPIHono } from '@hono/zod-openapi';
import listRouter from './list/list.index';
import getRouter from './get/get.index';
import postRouter from './post/post.index';
import patchRouter from './patch/patch.index';
import deleteRouter from './delete/delete.index';

const subnetRouter = new OpenAPIHono();

subnetRouter.route('/', listRouter);
subnetRouter.route('/', getRouter);
subnetRouter.route('/', postRouter);
subnetRouter.route('/', patchRouter);
subnetRouter.route('/', deleteRouter);

export default subnetRouter;
