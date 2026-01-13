import { OpenAPIHono } from '@hono/zod-openapi';
import { listKomodoStacksRoute } from './get.route';
import { listKomodoStacksHandler } from './get.handler';

const listKomodoStacksRouter = new OpenAPIHono();

listKomodoStacksRouter.openapi(listKomodoStacksRoute, listKomodoStacksHandler);

export default listKomodoStacksRouter;
