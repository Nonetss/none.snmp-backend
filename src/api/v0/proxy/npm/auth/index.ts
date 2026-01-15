import { OpenAPIHono } from '@hono/zod-openapi';
import getNpmAuthRouter from './get/get.index';
import postNpmAuthRouter from './post/post.index';
import deleteNpmAuthRouter from './delete/delete.index';
import patchNpmAuthRouter from './patch/patch.index';

const authRouter = new OpenAPIHono();

authRouter.route('/auth', getNpmAuthRouter);
authRouter.route('/auth', postNpmAuthRouter);
authRouter.route('/auth', deleteNpmAuthRouter);
authRouter.route('/auth', patchNpmAuthRouter);

export default authRouter;
