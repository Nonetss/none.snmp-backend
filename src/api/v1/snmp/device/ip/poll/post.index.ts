import { OpenAPIHono } from '@hono/zod-openapi';
import {
  postPollIpRoute,
  postPollSingleIpRoute,
} from '@/api/v1/snmp/device/ip/poll/post.route';
import {
  postPollIpHandler,
  postPollSingleIpHandler,
} from '@/api/v1/snmp/device/ip/poll/post.handler';

const postPollIpRouter = new OpenAPIHono();
postPollIpRouter.openapi(postPollIpRoute, postPollIpHandler);
postPollIpRouter.openapi(postPollSingleIpRoute, postPollSingleIpHandler);
export default postPollIpRouter;
