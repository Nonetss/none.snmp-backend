import { OpenAPIHono } from '@hono/zod-openapi';
import listDnsServerRouter from './list';
import getDnsServerRouter from './get';
import postDnsServerRouter from './post';
import patchDnsServerRouter from './patch';
import deleteDnsServerRouter from './delete';

const dnsServerRouter = new OpenAPIHono();

dnsServerRouter.route('/', listDnsServerRouter);
dnsServerRouter.route('/', getDnsServerRouter);
dnsServerRouter.route('/', postDnsServerRouter);
dnsServerRouter.route('/', patchDnsServerRouter);
dnsServerRouter.route('/', deleteDnsServerRouter);

export default dnsServerRouter;
