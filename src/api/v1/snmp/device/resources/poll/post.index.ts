import { OpenAPIHono } from '@hono/zod-openapi';
import {
  postPollResourcesRoute,
  postPollSingleResourceRoute,
} from '@/api/v1/snmp/device/resources/poll/post.route';
import {
  postPollResourcesHandler,
  postPollSingleResourceHandler,
} from '@/api/v1/snmp/device/resources/poll/post.handler';

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
