import { OpenAPIHono } from '@hono/zod-openapi';
import { patchDomainRoute } from './patch.route';
import { patchDomainHandler } from './patch.handler';

const patchDomainRouter = new OpenAPIHono();

patchDomainRouter.openapi(patchDomainRoute, patchDomainHandler);

export default patchDomainRouter;
