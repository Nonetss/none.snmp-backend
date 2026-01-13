import { OpenAPIHono } from '@hono/zod-openapi';
import { listKomodoServersRoute } from './get.route';
import { listKomodoServersHandler } from './get.handler';

const listKomodoServersRouter = new OpenAPIHono();

listKomodoServersRouter.openapi(
  listKomodoServersRoute,
  listKomodoServersHandler,
);

export default listKomodoServersRouter;
