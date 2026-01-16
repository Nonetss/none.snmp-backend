import { OpenAPIHono } from '@hono/zod-openapi';
import { listKomodoServersRoute } from '@/api/v0/komodo/server/list/get.route';
import { listKomodoServersHandler } from '@/api/v0/komodo/server/list/get.handler';

const listKomodoServersRouter = new OpenAPIHono();

listKomodoServersRouter.openapi(
  listKomodoServersRoute,
  listKomodoServersHandler,
);

export default listKomodoServersRouter;
