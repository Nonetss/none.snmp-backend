import { OpenAPIHono } from '@hono/zod-openapi';
import { getServiceFuzzySearchRoute } from './search.route';
import { getServiceFuzzySearchHandler } from './search.handler';

const router = new OpenAPIHono();

router.openapi(getServiceFuzzySearchRoute, getServiceFuzzySearchHandler);

export default router;
