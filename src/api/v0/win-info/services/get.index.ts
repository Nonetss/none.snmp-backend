import { OpenAPIHono } from '@hono/zod-openapi';
import { getComputerServicesHandler } from './get.handler';
import { getComputerServicesRoute } from './get.route';

const ComputerServicesGetApi = new OpenAPIHono();

ComputerServicesGetApi.openapi(
  getComputerServicesRoute,
  getComputerServicesHandler,
);

export default ComputerServicesGetApi;
