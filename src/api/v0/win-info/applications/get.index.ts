import { OpenAPIHono } from '@hono/zod-openapi';
import { getComputerApplicationsHandler } from './get.handler';
import { getComputerApplicationsRoute } from './get.route';

const ComputerApplicationsGetApi = new OpenAPIHono();

ComputerApplicationsGetApi.openapi(
  getComputerApplicationsRoute,
  getComputerApplicationsHandler,
);

export default ComputerApplicationsGetApi;
