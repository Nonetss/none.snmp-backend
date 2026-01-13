import { OpenAPIHono } from '@hono/zod-openapi';
import { postNpmAuthRoute } from './post.route';
import { postNpmAuthHandler } from './post.handler';

const postNpmAuthRouter = new OpenAPIHono();

postNpmAuthRouter.openapi(postNpmAuthRoute, postNpmAuthHandler);

export default postNpmAuthRouter;
