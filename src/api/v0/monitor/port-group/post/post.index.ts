import { OpenAPIHono } from '@hono/zod-openapi';
import { postMonitorPortGroupRoute } from './post.route';
import { postMonitorPortGroupHandler } from './post.handler';

const postRouter = new OpenAPIHono();
postRouter.openapi(postMonitorPortGroupRoute, postMonitorPortGroupHandler);
export default postRouter;
