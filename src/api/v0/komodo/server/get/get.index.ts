import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoServersRoute } from './get.route';
import { getKomodoServersHandler } from './get.handler';

const getKomodoServersRouter = new OpenAPIHono();

getKomodoServersRouter.openapi(getKomodoServersRoute, getKomodoServersHandler);

export default getKomodoServersRouter;
