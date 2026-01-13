import { OpenAPIHono } from '@hono/zod-openapi';
import getKomodoServersRouter from './get/get.index';

const komodoServerRouter = new OpenAPIHono();

komodoServerRouter.route('/', getKomodoServersRouter);

export default komodoServerRouter;
