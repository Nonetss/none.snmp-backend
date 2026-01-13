import { OpenAPIHono } from '@hono/zod-openapi';
import { listKomodoStacksRoute } from './list.route';
import { listKomodoStacksHandler } from './list.handler';

const listKomodoStacksRouter = new OpenAPIHono();

listKomodoStacksRouter.openapi(listKomodoStacksRoute, listKomodoStacksHandler);

export default listKomodoStacksRouter;
