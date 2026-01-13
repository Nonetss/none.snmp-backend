import { OpenAPIHono } from '@hono/zod-openapi';
import listKomodoContainersRouter from './list';
import getKomodoContainersByServerRouter from './get/get.index';

const komodoContainerRouter = new OpenAPIHono();

komodoContainerRouter.route('/', listKomodoContainersRouter);
komodoContainerRouter.route('/', getKomodoContainersByServerRouter);

export default komodoContainerRouter;
