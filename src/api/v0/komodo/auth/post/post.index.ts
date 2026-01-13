import { OpenAPIHono } from '@hono/zod-openapi';
import { postKomodoAuthRoute } from './post.route';
import { postKomodoAuthHandler } from './post.handler';

const postKomodoAuthRouter = new OpenAPIHono();

postKomodoAuthRouter.openapi(postKomodoAuthRoute, postKomodoAuthHandler);

export default postKomodoAuthRouter;
