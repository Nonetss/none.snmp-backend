import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';
import historyRouter from './get/get.index';

const loginRouter = new OpenAPIHono();

loginRouter.route('/', postRouter);
loginRouter.route('/history', historyRouter);

export default loginRouter;
