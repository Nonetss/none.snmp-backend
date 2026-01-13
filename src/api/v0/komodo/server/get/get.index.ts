import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoServerRoute } from './get.route';
import { getKomodoServerHandler } from './get.handler';

const getKomodoServerRouter = new OpenAPIHono();

getKomodoServerRouter.openapi(getKomodoServerRoute, getKomodoServerHandler);

export default getKomodoServerRouter;
