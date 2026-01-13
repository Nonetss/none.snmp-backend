import { OpenAPIHono } from '@hono/zod-openapi';
import { pangolinGetHandler } from './get.handler';
import { pangolinGetRoute } from './get.route';

const apiPangolinGet = new OpenAPIHono();

apiPangolinGet.openapi(pangolinGetRoute, pangolinGetHandler);

export default apiPangolinGet;
