import { OpenAPIHono } from '@hono/zod-openapi';
import getRouter from './get/get.index';
import scanRouter from './scan/scan.index';
import subnetScanRouter from './subnet-scan/scan.index';

const tcpRouter = new OpenAPIHono();

tcpRouter.route('/', getRouter);
tcpRouter.route('/', scanRouter);
tcpRouter.route('/', subnetScanRouter);

export default tcpRouter;
