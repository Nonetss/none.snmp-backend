import { OpenAPIHono } from '@hono/zod-openapi';
import {
  postPollResourcesRoute,
  postPollSingleResourceRoute,
} from './post.route';
import {
  postPollResourcesHandler,
  postPollSingleResourceHandler,
} from './post.handler';

const postPollResourcesRouter = new OpenAPIHono();

postPollResourcesRouter.openapi(
  postPollResourcesRoute,
  postPollResourcesHandler,
);
postPollResourcesRouter.openapi(
  postPollSingleResourceRoute,
  postPollSingleResourceHandler,
);

export default postPollResourcesRouter;
