import { OpenAPIHono } from '@hono/zod-openapi';
import { postPangolinAuthRoute } from './post.route';
import { postPangolinAuthHandler } from './post.handler';

const postPangolinAuthRouter = new OpenAPIHono();

postPangolinAuthRouter.openapi(postPangolinAuthRoute, postPangolinAuthHandler);

export default postPangolinAuthRouter;
