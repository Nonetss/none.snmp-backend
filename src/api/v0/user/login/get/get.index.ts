import { OpenAPIHono } from '@hono/zod-openapi';
import { getLoginHistoryHandler } from './get.handler';
import { getLoginHistoryRoute } from './get.route';

const LoginHistoryGetApi = new OpenAPIHono();

LoginHistoryGetApi.openapi(getLoginHistoryRoute, getLoginHistoryHandler);

export default LoginHistoryGetApi;
