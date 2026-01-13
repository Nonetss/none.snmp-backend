import { OpenAPIHono } from '@hono/zod-openapi';
import komodoServerRouter from './server';
import komodoStackRouter from './stacks';
import komodoContainerRouter from './container';

const komodoRouter = new OpenAPIHono();

komodoRouter.route('/server', komodoServerRouter);
komodoRouter.route('/stacks', komodoStackRouter);
komodoRouter.route('/container', komodoContainerRouter);

export default komodoRouter;
