import type { RouteHandler } from '@hono/zod-openapi';
import type { postPollAllRoute, postPollSingleAllRoute } from './post.route';
import { pollInterfaces } from '@/lib/snmp/poll/interface';
import { pollResources } from '@/lib/snmp/poll/resource';
import { pollIpSnmp } from '@/lib/snmp/poll/ip';
import { pollSystem } from '@/lib/snmp/poll/system';
import { pollBridge } from '@/lib/snmp/poll/bridge';

export const postPollAllHandler: RouteHandler<typeof postPollAllRoute> = async (
  c,
) => {
  await pollSystem();
  await pollInterfaces();
  await pollBridge();
  await pollResources();
  await pollIpSnmp();
  return c.json({ message: 'Success' }, 200);
};

export const postPollSingleAllHandler: RouteHandler<
  typeof postPollSingleAllRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);
  await pollSystem(deviceId);
  await pollInterfaces(deviceId);
  await pollBridge(deviceId);
  await pollResources(deviceId);
  await pollIpSnmp(deviceId);
  return c.json({ message: 'Success' }, 200);
};
