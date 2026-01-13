import { OpenAPIHono } from '@hono/zod-openapi';
import { getDomainRoute } from './get.route';
import { getDomainHandler } from './get.handler';

const getDomainRouter = new OpenAPIHono();

getDomainRouter.openapi(getDomainRoute, getDomainHandler);

export default getDomainRouter;
