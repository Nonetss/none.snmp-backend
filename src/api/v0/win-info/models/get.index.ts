import { OpenAPIHono } from '@hono/zod-openapi';
import { getComputerModelsHandler } from './get.handler';
import { getComputerModelsRoute } from './get.route';

const ComputerModelsGetApi = new OpenAPIHono();

ComputerModelsGetApi.openapi(getComputerModelsRoute, getComputerModelsHandler);

export default ComputerModelsGetApi;
