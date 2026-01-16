import { OpenAPIHono } from '@hono/zod-openapi';
import { getPangolinOrgRoute } from './get.route';
import { getPangolinOrgHandler } from './get.handler';

const getPangolinOrgRouter = new OpenAPIHono();

getPangolinOrgRouter.openapi(getPangolinOrgRoute, getPangolinOrgHandler);

export default getPangolinOrgRouter;
