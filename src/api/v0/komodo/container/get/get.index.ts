import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoContainerRoute } from '@/api/v0/komodo/container/get/get.route';
import { getKomodoContainerHandler } from '@/api/v0/komodo/container/get/get.handler';

const getKomodoContainerRouter = new OpenAPIHono();

getKomodoContainerRouter.openapi(
  getKomodoContainerRoute,
  getKomodoContainerHandler,
);

export default getKomodoContainerRouter;
