import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoStackRoute } from './get.route';
import { getKomodoStackHandler } from './get.handler';

const getKomodoStackRouter = new OpenAPIHono();

getKomodoStackRouter.openapi(getKomodoStackRoute, getKomodoStackHandler);

export default getKomodoStackRouter;
