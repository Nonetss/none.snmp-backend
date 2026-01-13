import { OpenAPIHono } from '@hono/zod-openapi';
import { postDnsServerRoute } from './post.route';
import { postDnsServerHandler } from './post.handler';

const postDnsServerRouter = new OpenAPIHono();

postDnsServerRouter.openapi(postDnsServerRoute, postDnsServerHandler);

export default postDnsServerRouter;
