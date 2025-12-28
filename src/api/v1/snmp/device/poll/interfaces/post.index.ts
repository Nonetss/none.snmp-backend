import { OpenAPIHono } from '@hono/zod-openapi';
import {
  postPollInterfacesRoute,
  postPollSingleInterfaceRoute,
} from './post.route';
import {
  postPollInterfacesHandler,
  postPollSingleInterfaceHandler,
} from './post.handler';

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
