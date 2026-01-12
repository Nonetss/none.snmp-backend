import { OpenAPIHono } from '@hono/zod-openapi';
import { getComputerStorageHandler } from './get.handler';
import { getComputerStorageRoute } from './get.route';

const ComputerStorageGetApi = new OpenAPIHono();

ComputerStorageGetApi.openapi(
  getComputerStorageRoute,
  getComputerStorageHandler,
);

export default ComputerStorageGetApi;
