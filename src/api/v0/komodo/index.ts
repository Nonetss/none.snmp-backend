import { OpenAPIHono } from '@hono/zod-openapi';
import komodoServerRouter from '@/api/v0/komodo/server';
import komodoStackRouter from '@/api/v0/komodo/stacks';
import komodoContainerRouter from '@/api/v0/komodo/container';
import komodoAuthRouter from '@/api/v0/komodo/auth';

const komodoRouter = new OpenAPIHono();

komodoRouter.route('/auth', komodoAuthRouter);
komodoRouter.route('/server', komodoServerRouter);
komodoRouter.route('/stacks', komodoStackRouter);
komodoRouter.route('/container', komodoContainerRouter);

export default komodoRouter;
