import { OpenAPIHono } from '@hono/zod-openapi';
import { listPortStatusRoute } from './list.route';
import { listPortStatusHandler } from './list.handler';

const status = new OpenAPIHono();

status.openapi(listPortStatusRoute, listPortStatusHandler);

export default status;
