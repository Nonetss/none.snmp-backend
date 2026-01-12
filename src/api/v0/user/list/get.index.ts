import { OpenAPIHono } from '@hono/zod-openapi';
import { getUserListHandler } from './get.handler';
import { getUserListRoute } from './get.route';

const UserListGetApi = new OpenAPIHono();

UserListGetApi.openapi(getUserListRoute, getUserListHandler);

export default UserListGetApi;
