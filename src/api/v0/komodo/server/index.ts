import { OpenAPIHono } from '@hono/zod-openapi';
import listKomodoServersRouter from './list/get.index';
import getKomodoServerRouter from './get/get.index';

const komodoServerRouter = new OpenAPIHono();

komodoServerRouter.route('/', listKomodoServersRouter);
komodoServerRouter.route('/', getKomodoServerRouter);

export default komodoServerRouter;
