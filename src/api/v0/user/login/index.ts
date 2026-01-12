import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';

const loginRouter = new OpenAPIHono();

loginRouter.route('/', postRouter);

export default loginRouter;
