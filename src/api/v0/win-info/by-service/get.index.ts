import { OpenAPIHono } from '@hono/zod-openapi';
import { getComputersByServiceHandler } from './get.handler';
import { getComputersByServiceRoute } from './get.route';

const ComputersByServiceGetApi = new OpenAPIHono();

ComputersByServiceGetApi.openapi(
  getComputersByServiceRoute,
  getComputersByServiceHandler,
);

export default ComputersByServiceGetApi;
