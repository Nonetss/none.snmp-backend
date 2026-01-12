import { OpenAPIHono } from '@hono/zod-openapi';
import { getComputerRamHandler } from './get.handler';
import { getComputerRamRoute } from './get.route';

const ComputerRamGetApi = new OpenAPIHono();

ComputerRamGetApi.openapi(getComputerRamRoute, getComputerRamHandler);

export default ComputerRamGetApi;
