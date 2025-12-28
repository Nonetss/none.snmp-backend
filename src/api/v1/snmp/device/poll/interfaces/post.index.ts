import { OpenAPIHono } from '@hono/zod-openapi';
import { postPollInterfacesRoute } from './post.route';
import { postPollInterfacesHandler } from './post.handler';

const postPollInterfacesRouter = new OpenAPIHono();

postPollInterfacesRouter.openapi(
  postPollInterfacesRoute,
  postPollInterfacesHandler,
);

export default postPollInterfacesRouter;
