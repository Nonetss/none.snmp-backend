import { OpenAPIHono } from '@hono/zod-openapi';
import { patchPangolinOrgRoute } from './patch.route';
import { patchPangolinOrgHandler } from './patch.handler';

const patchPangolinOrgRouter = new OpenAPIHono();

patchPangolinOrgRouter.openapi(patchPangolinOrgRoute, patchPangolinOrgHandler);

export default patchPangolinOrgRouter;
