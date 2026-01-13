import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoAuthRoute } from './get.route';
import { getKomodoAuthHandler } from './get.handler';

const getKomodoAuthRouter = new OpenAPIHono();

getKomodoAuthRouter.openapi(getKomodoAuthRoute, getKomodoAuthHandler);

export default getKomodoAuthRouter;
