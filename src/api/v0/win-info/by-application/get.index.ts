import { OpenAPIHono } from '@hono/zod-openapi';
import { getComputersByAppHandler } from './get.handler';
import { getComputersByAppRoute } from './get.route';

const ComputerByAppGetApi = new OpenAPIHono();

ComputerByAppGetApi.openapi(getComputersByAppRoute, getComputersByAppHandler);

export default ComputerByAppGetApi;
