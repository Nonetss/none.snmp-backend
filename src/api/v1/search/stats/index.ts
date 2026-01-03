import { OpenAPIHono } from '@hono/zod-openapi';
import { getStatsHandler } from './get.handler';
import { getStatsRoute } from './get.route';

const stats = new OpenAPIHono();

stats.openapi(getStatsRoute, getStatsHandler);

export default stats;
export * from './get.route';
export * from './get.handler';
export * from './get.schema';
