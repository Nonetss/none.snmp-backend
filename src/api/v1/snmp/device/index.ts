import { OpenAPIHono } from '@hono/zod-openapi';
import listRouter from '@/api/v1/snmp/device/list/list.index';
import deleteRouter from '@/api/v1/snmp/device/delete/delete.index';

// Interfaces
import pollInterfacesRouter from '@/api/v1/snmp/device/interfaces/poll/post.index';
import getDeviceInterfacesRouter from '@/api/v1/snmp/device/interfaces/get/get.index';

// Resources
import pollResourcesRouter from '@/api/v1/snmp/device/resources/poll/post.index';
import getDeviceResourcesRouter from '@/api/v1/snmp/device/resources/get/get.index';
import getDeviceServicesRouter from '@/api/v1/snmp/device/resources/services/get.index';

// IP
import pollIpRouter from '@/api/v1/snmp/device/ip/poll/post.index';
import getDeviceIpRouter from '@/api/v1/snmp/device/ip/get/get.index';

// System
import pollSystemRouter from '@/api/v1/snmp/device/system/poll/post.index';
import getDeviceSystemRouter from '@/api/v1/snmp/device/system/get/get.index';

// Bridge
import pollBridgeRouter from '@/api/v1/snmp/device/bridge/poll/post.index';
import getDeviceBridgeRouter from '@/api/v1/snmp/device/bridge/get/get.index';

// CDP
import pollCdpRouter from '@/api/v1/snmp/device/cdp/poll/post.index';
import getDeviceCdpRouter from '@/api/v1/snmp/device/cdp/get/get.index';

// LLDP
import pollLldpRouter from '@/api/v1/snmp/device/lldp/poll/post.index';
import getDeviceLldpRouter from '@/api/v1/snmp/device/lldp/get/get.index';

// Entity
import pollEntityRouter from '@/api/v1/snmp/device/entity/poll/post.index';
import getDeviceEntityRouter from '@/api/v1/snmp/device/entity/get/get.index';

// Routing
import pollRouteRouter from '@/api/v1/snmp/device/route/poll/post.index';
import getDeviceRouteRouter from '@/api/v1/snmp/device/route/get/get.index';

// All
import pollAllRouter from '@/api/v1/snmp/device/all/poll/post.index';
import getDeviceAllRouter from '@/api/v1/snmp/device/all/get/get.index';

const deviceRouter = new OpenAPIHono();

// Base routes
deviceRouter.route('/', listRouter);
deviceRouter.route('/', deleteRouter);

// Inventory routes (GET)
deviceRouter.route('/', getDeviceResourcesRouter);
deviceRouter.route('/', getDeviceServicesRouter);
deviceRouter.route('/', getDeviceInterfacesRouter);
deviceRouter.route('/', getDeviceIpRouter);
deviceRouter.route('/', getDeviceSystemRouter);
deviceRouter.route('/', getDeviceBridgeRouter);
deviceRouter.route('/', getDeviceCdpRouter);
deviceRouter.route('/', getDeviceLldpRouter);
deviceRouter.route('/', getDeviceEntityRouter);
deviceRouter.route('/', getDeviceRouteRouter);
deviceRouter.route('/', getDeviceAllRouter);

// Polling routes (POST)
deviceRouter.route('/poll', pollInterfacesRouter);
deviceRouter.route('/poll', pollResourcesRouter);
deviceRouter.route('/poll', pollIpRouter);
deviceRouter.route('/poll', pollSystemRouter);
deviceRouter.route('/poll', pollBridgeRouter);
deviceRouter.route('/poll', pollCdpRouter);
deviceRouter.route('/poll', pollLldpRouter);
deviceRouter.route('/poll', pollEntityRouter);
deviceRouter.route('/poll', pollRouteRouter);
deviceRouter.route('/poll', pollAllRouter);

export default deviceRouter;
