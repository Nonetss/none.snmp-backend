import { OpenAPIHono } from '@hono/zod-openapi';
import { listKomodoStacksRoute } from '@/api/v0/komodo/stacks/list/get.route';
import { listKomodoStacksHandler } from '@/api/v0/komodo/stacks/list/get.handler';

const listKomodoStacksRouter = new OpenAPIHono();

listKomodoStacksRouter.openapi(listKomodoStacksRoute, listKomodoStacksHandler);

export default listKomodoStacksRouter;
