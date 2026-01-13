import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoStacksByServerRoute } from './get.route';
import { getKomodoStacksByServerHandler } from './get.handler';

const getKomodoStacksByServerRouter = new OpenAPIHono();

getKomodoStacksByServerRouter.openapi(
  getKomodoStacksByServerRoute,
  getKomodoStacksByServerHandler,
);

export default getKomodoStacksByServerRouter;
