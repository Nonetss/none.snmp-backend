import { OpenAPIHono } from '@hono/zod-openapi';
import { getWinInfoHandler } from './get.handler';
import { getWinInfoRoute } from './get.route';

const WinInfoGetApi = new OpenAPIHono();

WinInfoGetApi.openapi(getWinInfoRoute, getWinInfoHandler);

export default WinInfoGetApi;
