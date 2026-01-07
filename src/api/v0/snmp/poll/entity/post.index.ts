import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollEntityRoute, postPollSingleEntityRoute } from './post.route';
import {
  postPollEntityHandler,
  postPollSingleEntityHandler,
} from './post.handler';

const pollEntityRouter = new OpenAPIHono();

pollEntityRouter.openapi(postPollEntityRoute, postPollEntityHandler);
pollEntityRouter.openapi(
  postPollSingleEntityRoute,
  postPollSingleEntityHandler,
);

export default pollEntityRouter;
