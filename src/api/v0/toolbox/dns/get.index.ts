import { OpenAPIHono } from '@hono/zod-openapi';
import { getDnsRoute } from './get.route';
import { getDnsHandler } from './get.handler';

const getDnsRouter = new OpenAPIHono();

getDnsRouter.openapi(getDnsRoute, getDnsHandler);

export default getDnsRouter;
