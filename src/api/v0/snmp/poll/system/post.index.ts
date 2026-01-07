import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollSystemRoute, postPollSingleSystemRoute } from './post.route';
import {
  postPollSystemHandler,
  postPollSingleSystemHandler,
} from './post.handler';

const postPollSystemRouter = new OpenAPIHono();
postPollSystemRouter.openapi(postPollSystemRoute, postPollSystemHandler);
postPollSystemRouter.openapi(
  postPollSingleSystemRoute,
  postPollSingleSystemHandler,
);
export default postPollSystemRouter;
