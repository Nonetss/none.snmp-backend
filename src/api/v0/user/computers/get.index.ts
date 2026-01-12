import { OpenAPIHono } from '@hono/zod-openapi';
import { getComputersByUserHandler } from './get.handler';
import { getComputersByUserRoute } from './get.route';

const UserComputersGetApi = new OpenAPIHono();

UserComputersGetApi.openapi(getComputersByUserRoute, getComputersByUserHandler);

export default UserComputersGetApi;
