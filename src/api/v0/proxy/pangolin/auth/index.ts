import { OpenAPIHono } from '@hono/zod-openapi';
import getPangolinAuthRouter from './get/get.index';
import postPangolinAuthRouter from './post/post.index';
import deletePangolinAuthRouter from './delete/delete.index';
import patchPangolinAuthRouter from './patch/patch.index';

const authRouter = new OpenAPIHono();

authRouter.route('/', getPangolinAuthRouter);
authRouter.route('/', postPangolinAuthRouter);
authRouter.route('/', deletePangolinAuthRouter);
authRouter.route('/', patchPangolinAuthRouter);

export default authRouter;
