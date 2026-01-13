import { OpenAPIHono } from '@hono/zod-openapi';
import listKomodoStacksRouter from './list';
import getKomodoStacksByServerRouter from './get/get.index';

const komodoStackRouter = new OpenAPIHono();

komodoStackRouter.route('/', listKomodoStacksRouter);
komodoStackRouter.route('/server', getKomodoStacksByServerRouter);

export default komodoStackRouter;
