import { OpenAPIHono } from '@hono/zod-openapi';
import { listDomainRoute } from './list.route';
import { listDomainHandler } from './list.handler';

const listDomainRouter = new OpenAPIHono();

listDomainRouter.openapi(listDomainRoute, listDomainHandler);

export default listDomainRouter;
