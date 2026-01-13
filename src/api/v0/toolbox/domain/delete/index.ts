import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteDomainRoute } from './delete.route';
import { deleteDomainHandler } from './delete.handler';

const deleteDomainRouter = new OpenAPIHono();

deleteDomainRouter.openapi(deleteDomainRoute, deleteDomainHandler);

export default deleteDomainRouter;
