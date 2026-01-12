import { OpenAPIHono } from '@hono/zod-openapi';
import { getApplicationNamesHandler } from './get.handler';
import { getApplicationNamesRoute } from './get.route';

const ApplicationNamesGetApi = new OpenAPIHono();

ApplicationNamesGetApi.openapi(
  getApplicationNamesRoute,
  getApplicationNamesHandler,
);

export default ApplicationNamesGetApi;
