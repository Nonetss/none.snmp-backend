import { OpenAPIHono } from '@hono/zod-openapi';
import { getResourceFuzzySearchRoute } from './search.route';
import { getResourceFuzzySearchHandler } from './search.handler';

const router = new OpenAPIHono();

router.openapi(getResourceFuzzySearchRoute, getResourceFuzzySearchHandler);

export default router;
