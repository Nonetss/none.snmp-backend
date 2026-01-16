import { OpenAPIHono } from '@hono/zod-openapi';
import { postPangolinOrgRoute } from './post.route';
import { postPangolinOrgHandler } from './post.handler';

const postPangolinOrgRouter = new OpenAPIHono();

postPangolinOrgRouter.openapi(postPangolinOrgRoute, postPangolinOrgHandler);

export default postPangolinOrgRouter;
