import { OpenAPIHono } from '@hono/zod-openapi';
import { listPortStatusRoute } from './list.route';
import { listPortStatusHandler } from './list.handler';

const listStatus = new OpenAPIHono();

listStatus.openapi(listPortStatusRoute, listPortStatusHandler);

export default listStatus;
