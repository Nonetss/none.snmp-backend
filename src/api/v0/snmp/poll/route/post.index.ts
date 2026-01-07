import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollRouteRoute, postPollSingleRouteRoute } from './post.route';
import {
  postPollRouteHandler,
  postPollSingleRouteHandler,
} from './post.handler';

const pollRouteRouter = new OpenAPIHono();

pollRouteRouter.openapi(postPollRouteRoute, postPollRouteHandler);
pollRouteRouter.openapi(postPollSingleRouteRoute, postPollSingleRouteHandler);

export default pollRouteRouter;
