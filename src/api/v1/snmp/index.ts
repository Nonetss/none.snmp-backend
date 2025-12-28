import { OpenAPIHono } from '@hono/zod-openapi';
import authRouter from '@/api/v1/snmp/auth';
import scanRouter from '@/api/v1/snmp/scan';
import deviceRouter from '@/api/v1/snmp/device';
import metricsRouter from '@/api/v1/snmp/metrics';

const snmpRouter = new OpenAPIHono();

snmpRouter.route('/auth', authRouter);
snmpRouter.route('/scan', scanRouter);
snmpRouter.route('/device', deviceRouter);
snmpRouter.route('/metrics', metricsRouter);

export default snmpRouter;
