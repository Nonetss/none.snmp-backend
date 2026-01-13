import { OpenAPIHono } from '@hono/zod-openapi';
import { listKomodoContainersRoute } from './get.route';
import { listKomodoContainersHandler } from './get.handler';

const listKomodoContainersRouter = new OpenAPIHono();

listKomodoContainersRouter.openapi(
  listKomodoContainersRoute,
  listKomodoContainersHandler,
);

export default listKomodoContainersRouter;
