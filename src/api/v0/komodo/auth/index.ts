import { OpenAPIHono } from '@hono/zod-openapi';
import getKomodoAuthRouter from './get/get.index';
import postKomodoAuthRouter from './post/post.index';
import deleteKomodoAuthRouter from './delete/delete.index';
import patchKomodoAuthRouter from './patch/patch.index';

const authRouter = new OpenAPIHono();

authRouter.route('/', getKomodoAuthRouter);
authRouter.route('/', postKomodoAuthRouter);
authRouter.route('/', deleteKomodoAuthRouter);
authRouter.route('/', patchKomodoAuthRouter);

export default authRouter;
