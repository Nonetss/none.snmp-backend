import { OpenAPIHono } from '@hono/zod-openapi';
import { getDeviceLldpRoute } from './get.route';
import { getDeviceLldpHandler } from './get.handler';

const getDeviceLldpRouter = new OpenAPIHono();

getDeviceLldpRouter.openapi(getDeviceLldpRoute, getDeviceLldpHandler);

export default getDeviceLldpRouter;
