import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollIpRoute } from './post.route';
import { postPollIpHandler } from './post.handler';

const postPollIpRouter = new OpenAPIHono();

postPollIpRouter.openapi(postPollIpRoute, postPollIpHandler);

export default postPollIpRouter;
