import { OpenAPIHono } from '@hono/zod-openapi';
import getKomodoServersRouter from './get/get.index';

const komodoContainerRouter = new OpenAPIHono();

komodoContainerRouter.route('/', getKomodoServersRouter);

export default komodoContainerRouter;
