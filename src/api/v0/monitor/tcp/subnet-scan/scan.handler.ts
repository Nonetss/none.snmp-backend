import { getAllIps } from '@/lib/ip';
import { checkTcpPort } from '@/lib/tcp';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postSubnetPortScanRoute } from './scan.route';

export const postSubnetPortScanHandler: RouteHandler<
  typeof postSubnetPortScanRoute
> = async (c) => {
  try {
    const { subnet, allPorts, timeout, concurrency } = c.req.valid('json');

    const ips = getAllIps(subnet);
    if (ips.length === 0) {
      return c.json({ message: 'Invalid subnet' }, 400) as any;
    }

    const startPort = 1;
    const endPort = allPorts ? 65535 : 1024; // Por defecto los primeros 1000

    // Generar lista de tareas plana (IP, Port)
    const tasks: { ip: string; port: number }[] = [];
    for (const ip of ips) {
      for (let p = startPort; p <= endPort; p++) {
        tasks.push({ ip, port: p });
      }
    }

    // Aumentamos la concurrencia global significativamente para "mega fast"
    // Bun maneja miles de sockets fácilmente si el OS lo permite.
    const globalConcurrency = concurrency > 100 ? concurrency : 2000;

    const openResults: { ip: string; port: number; time: number }[] = [];

    // Función de procesamiento para el pool
    const scanTask = async (task: { ip: string; port: number }) => {
      const res = await checkTcpPort(task.ip, task.port, timeout);
      if (res.open) {
        openResults.push({
          ip: task.ip,
          port: task.port,
          time: res.time as number,
        });
      }
    };

    // Usamos una versión local del pool o simplemente un procesador de cola
    // Para no duplicar código, pero como pool es privada en lib/tcp,
    // implementamos una lógica de workers aquí para máxima velocidad.
    const workers = Array.from(
      { length: Math.min(globalConcurrency, tasks.length) },
      async () => {
        while (tasks.length > 0) {
          const task = tasks.pop();
          if (task) await scanTask(task);
        }
      },
    );

    await Promise.all(workers);

    // Agrupar resultados por IP
    const resultsMap = new Map<string, { port: number; time: number }[]>();
    for (const res of openResults) {
      const list = resultsMap.get(res.ip) || [];
      list.push({ port: res.port, time: res.time });
      resultsMap.set(res.ip, list);
    }

    const results = Array.from(resultsMap.entries()).map(([ip, openPorts]) => ({
      ip,
      openPorts: openPorts.sort((a, b) => a.port - b.port),
    }));

    return c.json(
      {
        subnet,
        results,
        totalIpsScanned: ips.length,
      },
      200,
    );
  } catch (error) {
    console.error('[Subnet Port Scan] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
