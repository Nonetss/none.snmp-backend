import listKomodoStacksRouter from '@/api/v0/komodo/stacks/list/get.index';
import getKomodoStackRouter from '@/api/v0/komodo/stacks/get/get.index';
import { OpenAPIHono } from '@hono/zod-openapi';

const komodoStackRouter = new OpenAPIHono();

komodoStackRouter.route('/', listKomodoStacksRouter);
komodoStackRouter.route('/', getKomodoStackRouter);

export default komodoStackRouter;
