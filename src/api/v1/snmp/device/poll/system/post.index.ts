import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollSystemRoute } from './post.route';
import { postPollSystemHandler } from './post.handler';

const postPollSystemRouter = new OpenAPIHono();

postPollSystemRouter.openapi(postPollSystemRoute, postPollSystemHandler);

export default postPollSystemRouter;
