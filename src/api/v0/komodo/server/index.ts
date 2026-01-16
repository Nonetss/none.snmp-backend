import { OpenAPIHono } from '@hono/zod-openapi';
import listKomodoServersRouter from '@/api/v0/komodo/server/list/get.index';
import getKomodoServerRouter from '@/api/v0/komodo/server/get/get.index';

const komodoServerRouter = new OpenAPIHono();

komodoServerRouter.route('/', listKomodoServersRouter);
komodoServerRouter.route('/', getKomodoServerRouter);

export default komodoServerRouter;
