import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';
import listRouter from './list/list.index';
import getRouter from './get/get.index';
import patchRouter from './patch/patch.index';
import deleteRouter from './delete/delete.index';

const ruleRouter = new OpenAPIHono();

ruleRouter.route('/', postRouter);
ruleRouter.route('/', listRouter);
ruleRouter.route('/', getRouter);
ruleRouter.route('/', patchRouter);
ruleRouter.route('/', deleteRouter);

export default ruleRouter;
