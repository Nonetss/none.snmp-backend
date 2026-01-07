import { OpenAPIHono } from '@hono/zod-openapi';
import { listDevicesHandler } from './list.handler';
import { listDevicesRoute } from './list.route';

const listDevices = new OpenAPIHono();

listDevices.openapi(listDevicesRoute, listDevicesHandler);

export default listDevices;
