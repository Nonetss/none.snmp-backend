import { OpenAPIHono } from '@hono/zod-openapi';
import resourceGetRouter from './get/get.index';
import resourceListRouter from './list/list.index';
import resourceInventoryRouter from './inventory/inventory.index';
import resourceFuzzySearchRouter from './search/search.index';

const resourceRouter = new OpenAPIHono();

resourceRouter.route('/', resourceFuzzySearchRouter);
resourceRouter.route('/', resourceInventoryRouter);
resourceRouter.route('/', resourceListRouter);
resourceRouter.route('/', resourceGetRouter);
export default resourceRouter;
