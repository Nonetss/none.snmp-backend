import { OpenAPIHono } from '@hono/zod-openapi';
import { listKomodoContainersRoute } from './list.route';
import { listKomodoContainersHandler } from './list.handler';

const listKomodoContainersRouter = new OpenAPIHono();

listKomodoContainersRouter.openapi(
  listKomodoContainersRoute,
  listKomodoContainersHandler,
);

export default listKomodoContainersRouter;
