import { OpenAPIHono } from '@hono/zod-openapi';
import getNpmAuthRouter from './get/get.index';
import postNpmAuthRouter from './post/post.index';
import deleteNpmAuthRouter from './delete/delete.index';
import patchNpmAuthRouter from './patch/patch.index';

const authRouter = new OpenAPIHono();

authRouter.route('/', getNpmAuthRouter);
authRouter.route('/', postNpmAuthRouter);
authRouter.route('/', deleteNpmAuthRouter);
authRouter.route('/', patchNpmAuthRouter);

export default authRouter;
