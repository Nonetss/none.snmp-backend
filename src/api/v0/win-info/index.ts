import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';

const winInfoRouter = new OpenAPIHono();

winInfoRouter.route('/', postRouter);

export default winInfoRouter;
