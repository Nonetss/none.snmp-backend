import { OpenAPIHono } from '@hono/zod-openapi';
import { getLastLoginHandler } from './get.handler';
import { getLastLoginRoute } from './get.route';

const ComputerLastLoginApi = new OpenAPIHono();

ComputerLastLoginApi.openapi(getLastLoginRoute, getLastLoginHandler);

export default ComputerLastLoginApi;
