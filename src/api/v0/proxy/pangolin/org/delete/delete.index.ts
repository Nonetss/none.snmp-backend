import { OpenAPIHono } from '@hono/zod-openapi';
import { deletePangolinOrgRoute } from './delete.route';
import { deletePangolinOrgHandler } from './delete.handler';

const deletePangolinOrgRouter = new OpenAPIHono();

deletePangolinOrgRouter.openapi(
  deletePangolinOrgRoute,
  deletePangolinOrgHandler,
);

export default deletePangolinOrgRouter;
