import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';
import listRouter from './list/list.index';
import getRouter from './get/get.index';
import patchRouter from './patch/patch.index';
import deleteRouter from './delete/delete.index';

const portGroupRouter = new OpenAPIHono();

portGroupRouter.route('/', postRouter);
portGroupRouter.route('/', listRouter);
portGroupRouter.route('/', getRouter);
portGroupRouter.route('/', patchRouter);
portGroupRouter.route('/', deleteRouter);

export default portGroupRouter;
