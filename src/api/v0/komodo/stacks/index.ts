import listKomodoStacksRouter from './list/get.index';
import getKomodoStackRouter from './get/get.index';
import { OpenAPIHono } from '@hono/zod-openapi';

const komodoStackRouter = new OpenAPIHono();

komodoStackRouter.route('/', listKomodoStacksRouter);
komodoStackRouter.route('/', getKomodoStackRouter);

export default komodoStackRouter;
