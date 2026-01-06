import { OpenAPIHono } from '@hono/zod-openapi';
import authRouter from '@/api/v1/snmp/auth';
import scanRouter from '@/api/v1/snmp/scan';
import deviceRouter from '@/api/v1/snmp/device';
import subnetRouter from '@/api/v1/snmp/subnet';
import pollRouter from '@/api/v1/snmp/poll';
import schedulerRouter from '@/api/v1/snmp/scheduler';
import metricsRouter from '@/api/v1/snmp/metrics';

const snmpRouter = new OpenAPIHono();

snmpRouter.route('/auth', authRouter);
snmpRouter.route('/scan', scanRouter);
snmpRouter.route('/subnet', subnetRouter);
snmpRouter.route('/poll', pollRouter);
snmpRouter.route('/scheduler', schedulerRouter);
snmpRouter.route('/device', deviceRouter);
snmpRouter.route('/metrics', metricsRouter);

export default snmpRouter;
