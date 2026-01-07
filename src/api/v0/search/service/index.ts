import { OpenAPIHono } from '@hono/zod-openapi';
import serviceGetRouter from './get/get.index';
import serviceListRouter from './list/list.index';
import serviceInventoryRouter from './inventory/inventory.index';
import serviceFuzzySearchRouter from './search/search.index';

const serviceRouter = new OpenAPIHono();

serviceRouter.route('/', serviceFuzzySearchRouter);
serviceRouter.route('/', serviceInventoryRouter);
serviceRouter.route('/', serviceListRouter);
serviceRouter.route('/', serviceGetRouter);
export default serviceRouter;
