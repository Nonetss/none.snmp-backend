import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoContainerRoute } from './get.route';
import { getKomodoContainerHandler } from './get.handler';

const getKomodoContainerRouter = new OpenAPIHono();

getKomodoContainerRouter.openapi(
  getKomodoContainerRoute,
  getKomodoContainerHandler,
);

export default getKomodoContainerRouter;
