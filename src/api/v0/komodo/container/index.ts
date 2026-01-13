import listKomodoContainersRouter from './list/get.index';
import getKomodoContainerRouter from './get/get.index';
import { OpenAPIHono } from '@hono/zod-openapi';

const komodoContainerRouter = new OpenAPIHono();

komodoContainerRouter.route('/', listKomodoContainersRouter);
komodoContainerRouter.route('/', getKomodoContainerRouter);

export default komodoContainerRouter;
