import { OpenAPIHono } from '@hono/zod-openapi';
import { getComputersHandler } from './get.handler';
import { getComputersRoute } from './get.route';

const ComputerGetApi = new OpenAPIHono();

ComputerGetApi.openapi(getComputersRoute, getComputersHandler);

export default ComputerGetApi;
