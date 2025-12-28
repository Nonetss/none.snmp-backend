import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollIpRoute, postPollSingleIpRoute } from './post.route';
import { postPollIpHandler, postPollSingleIpHandler } from './post.handler';

const postPollIpRouter = new OpenAPIHono();
postPollIpRouter.openapi(postPollIpRoute, postPollIpHandler);
postPollIpRouter.openapi(postPollSingleIpRoute, postPollSingleIpHandler);
export default postPollIpRouter;
