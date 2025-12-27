import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from './post/post.index';

const scanRouter = new OpenAPIHono();

scanRouter.route('/', postRouter);

export default scanRouter;
