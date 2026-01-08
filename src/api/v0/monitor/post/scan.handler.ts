import { scanPorts } from '@/lib/tcp';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postPortScanRoute } from './scan.route';

export const postPortScanHandler: RouteHandler<
  typeof postPortScanRoute
> = async (c) => {
  try {
    const { ip, allPorts, timeout, concurrency } = c.req.valid('json');

    const startPort = 1;
    const endPort = allPorts ? 65535 : 10000;

    // Generar lista de puertos
    const ports = [];
    for (let p = startPort; p <= endPort; p++) {
      ports.push(p);
    }

    const openPorts = await scanPorts(ip, ports, concurrency, timeout);

    return c.json(
      {
        ip,
        openPorts,
        totalScanned: ports.length,
      },
      200,
    );
  } catch (error) {
    console.error('[Port Scan] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
