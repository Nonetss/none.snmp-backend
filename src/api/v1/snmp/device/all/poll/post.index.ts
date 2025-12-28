import { OpenAPIHono } from '@hono/zod-openapi';
import {
  postPollAllRoute,
  postPollSingleAllRoute,
} from '@/api/v1/snmp/device/all/poll/post.route';
import {
  postPollAllHandler,
  postPollSingleAllHandler,
} from '@/api/v1/snmp/device/all/poll/post.handler';

const postPollAllRouter = new OpenAPIHono();
postPollAllRouter.openapi(postPollAllRoute, postPollAllHandler);
postPollAllRouter.openapi(postPollSingleAllRoute, postPollSingleAllHandler);
export default postPollAllRouter;
