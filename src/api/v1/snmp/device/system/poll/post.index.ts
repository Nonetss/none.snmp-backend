import { OpenAPIHono } from '@hono/zod-openapi';
import {
  postPollSystemRoute,
  postPollSingleSystemRoute,
} from '@/api/v1/snmp/device/system/poll/post.route';
import {
  postPollSystemHandler,
  postPollSingleSystemHandler,
} from '@/api/v1/snmp/device/system/poll/post.handler';

const postPollSystemRouter = new OpenAPIHono();
postPollSystemRouter.openapi(postPollSystemRoute, postPollSystemHandler);
postPollSystemRouter.openapi(
  postPollSingleSystemRoute,
  postPollSingleSystemHandler,
);
export default postPollSystemRouter;
