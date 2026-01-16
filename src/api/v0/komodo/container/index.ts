import listKomodoContainersRouter from '@/api/v0/komodo/container/list/get.index';
import getKomodoContainerRouter from '@/api/v0/komodo/container/get/get.index';
import { OpenAPIHono } from '@hono/zod-openapi';

const komodoContainerRouter = new OpenAPIHono();

komodoContainerRouter.route('/', listKomodoContainersRouter);
komodoContainerRouter.route('/', getKomodoContainerRouter);

export default komodoContainerRouter;
