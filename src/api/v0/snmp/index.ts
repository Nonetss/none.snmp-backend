import { OpenAPIHono } from '@hono/zod-openapi';
import authRouter from '@/api/v0/snmp/auth';
import scanRouter from '@/api/v0/snmp/scan';
import deviceRouter from '@/api/v0/snmp/device';
import subnetRouter from '@/api/v0/snmp/subnet';
import pollRouter from '@/api/v0/snmp/poll';
import schedulerRouter from '@/api/v0/snmp/scheduler';
import metricsRouter from '@/api/v0/snmp/metrics';

const snmpRouter = new OpenAPIHono();

snmpRouter.route('/auth', authRouter);
snmpRouter.route('/scan', scanRouter);
snmpRouter.route('/subnet', subnetRouter);
snmpRouter.route('/poll', pollRouter);
snmpRouter.route('/scheduler', schedulerRouter);
snmpRouter.route('/device', deviceRouter);
snmpRouter.route('/metrics', metricsRouter);

export default snmpRouter;
