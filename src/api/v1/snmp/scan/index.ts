import { OpenAPIHono } from '@hono/zod-openapi';
import postRouter from '@/api/v1/snmp/scan/post/post.index';

const scanRouter = new OpenAPIHono();

scanRouter.route('/', postRouter);

export default scanRouter;
