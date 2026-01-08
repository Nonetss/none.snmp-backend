import { OpenAPIHono } from '@hono/zod-openapi';
import { postNotificationActionRoute } from './post/post.route';
import { postNotificationActionHandler } from './post/post.handler';
import { postNtfyActionRoute } from './ntfy/post/post.route';
import { postNtfyActionHandler } from './ntfy/post/post.handler';

const actionRouter = new OpenAPIHono();

actionRouter.openapi(
  postNotificationActionRoute,
  postNotificationActionHandler,
);
actionRouter.openapi(postNtfyActionRoute, postNtfyActionHandler);

export default actionRouter;
