import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoContainersByServerRoute } from './get.route';
import { getKomodoContainersByServerHandler } from './get.handler';

const getKomodoContainersByServerRouter = new OpenAPIHono();

getKomodoContainersByServerRouter.openapi(
  getKomodoContainersByServerRoute,
  getKomodoContainersByServerHandler,
);

export default getKomodoContainersByServerRouter;
