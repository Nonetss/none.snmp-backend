import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoServerRoute } from '@/api/v0/komodo/server/get/get.route';
import { getKomodoServerHandler } from '@/api/v0/komodo/server/get/get.handler';

const getKomodoServerRouter = new OpenAPIHono();

getKomodoServerRouter.openapi(getKomodoServerRoute, getKomodoServerHandler);

export default getKomodoServerRouter;
