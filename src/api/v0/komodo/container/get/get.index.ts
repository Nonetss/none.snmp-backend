import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoContainersRoute } from './get.route';
import { getKomodoContainersHandler } from './get.handler';

const getKomodoContainerRouter = new OpenAPIHono();

getKomodoContainerRouter.openapi(
  getKomodoContainersRoute,
  getKomodoContainersHandler,
);

export default getKomodoContainerRouter;
