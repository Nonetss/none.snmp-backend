import { OpenAPIHono } from '@hono/zod-openapi';
import { postNotificationActionRoute } from '@/api/v0/notifications/action/post/post.route';
import { postNotificationActionHandler } from '@/api/v0/notifications/action/post/post.handler';
import { postNtfyActionRoute } from '@/api/v0/notifications/action/ntfy/post/post.route';
import { postNtfyActionHandler } from '@/api/v0/notifications/action/ntfy/post/post.handler';

const actionRouter = new OpenAPIHono();

actionRouter.openapi(
  postNotificationActionRoute,
  postNotificationActionHandler,
);
actionRouter.openapi(postNtfyActionRoute, postNtfyActionHandler);

export default actionRouter;
