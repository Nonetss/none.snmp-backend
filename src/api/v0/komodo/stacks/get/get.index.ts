import { OpenAPIHono } from '@hono/zod-openapi';
import { getKomodoStackRoute } from '@/api/v0/komodo/stacks/get/get.route';
import { getKomodoStackHandler } from '@/api/v0/komodo/stacks/get/get.handler';

const getKomodoStackRouter = new OpenAPIHono();

getKomodoStackRouter.openapi(getKomodoStackRoute, getKomodoStackHandler);

export default getKomodoStackRouter;
