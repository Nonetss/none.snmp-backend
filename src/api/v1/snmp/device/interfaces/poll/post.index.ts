import { OpenAPIHono } from '@hono/zod-openapi';
import {
  postPollInterfacesRoute,
  postPollSingleInterfaceRoute,
} from '@/api/v1/snmp/device/interfaces/poll/post.route';
import {
  postPollInterfacesHandler,
  postPollSingleInterfaceHandler,
} from '@/api/v1/snmp/device/interfaces/poll/post.handler';

const postPollInterfacesRouter = new OpenAPIHono();

postPollInterfacesRouter.openapi(
  postPollInterfacesRoute,
  postPollInterfacesHandler,
);
postPollInterfacesRouter.openapi(
  postPollSingleInterfaceRoute,
  postPollSingleInterfaceHandler,
);

export default postPollInterfacesRouter;
