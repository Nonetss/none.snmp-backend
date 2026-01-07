import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollAllRoute, postPollSingleAllRoute } from './post.route';
import { postPollAllHandler, postPollSingleAllHandler } from './post.handler';

const postPollAllRouter = new OpenAPIHono();
postPollAllRouter.openapi(postPollAllRoute, postPollAllHandler);
postPollAllRouter.openapi(postPollSingleAllRoute, postPollSingleAllHandler);
export default postPollAllRouter;
