import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/index';
import patchRouter from './patch/index';
import deleteRouter from './delete/index';

const ntfyRouter = new OpenAPIHono();

ntfyRouter.route('/', postRouter);
ntfyRouter.route('/', patchRouter);
ntfyRouter.route('/', deleteRouter);

export default ntfyRouter;
