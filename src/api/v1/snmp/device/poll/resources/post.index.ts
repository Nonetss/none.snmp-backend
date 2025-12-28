import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollResourcesRoute } from './post.route';
import { postPollResourcesHandler } from './post.handler';

const postPollResourcesRouter = new OpenAPIHono();

postPollResourcesRouter.openapi(
  postPollResourcesRoute,
  postPollResourcesHandler,
);

export default postPollResourcesRouter;
