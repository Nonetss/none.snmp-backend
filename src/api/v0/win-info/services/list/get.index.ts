import { OpenAPIHono } from '@hono/zod-openapi';
import { getServiceNamesHandler } from './get.handler';
import { getServiceNamesRoute } from './get.route';

const ServiceNamesGetApi = new OpenAPIHono();

ServiceNamesGetApi.openapi(getServiceNamesRoute, getServiceNamesHandler);

export default ServiceNamesGetApi;
