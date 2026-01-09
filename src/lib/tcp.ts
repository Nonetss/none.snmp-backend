import * as net from 'node:net';
import { logger } from '@/lib/logger';

export interface TcpCheckResult {
  open: boolean;
  time: number | 'unknown';
}

/**
 * Realiza una comprobación de puerto TCP (similar a nc -vz).
 * @param ip Dirección IP del host
 * @param port Puerto a comprobar
 * @param timeout Timeout en milisegundos (por defecto 2000)
 */
export async function checkTcpPort(
  ip: string,
  port: number,
  timeout = 2000,
): Promise<TcpCheckResult> {
  return new Promise((resolve) => {
    const start = performance.now();
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      const end = performance.now();
      socket.destroy();
      resolve({
        open: true,
        time: Math.round(end - start),
      });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({
        open: false,
        time: 'unknown',
      });
    });

    socket.on('error', (err) => {
      socket.destroy();
      resolve({
        open: false,
        time: 'unknown',
      });
    });

    socket.connect(port, ip);
  });
}

/**
 * Utility to process tasks with a concurrency limit using a worker pool.
 */
async function pool<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (index < items.length) {
        const i = index++;
        results[i] = await fn(items[i]);
      }
    },
  );

  await Promise.all(workers);
  return results;
}

/**
 * Escanea un rango de puertos o una lista específica de forma concurrente.
 */
export async function scanPorts(
  ip: string,
  ports: number[],
  concurrency = 100,
  timeout = 1000,
): Promise<{ port: number; time: number }[]> {
  const results = await pool(
    ports,
    async (port) => {
      const res = await checkTcpPort(ip, port, timeout);
      return { port, ...res };
    },
    concurrency,
  );

  return results
    .filter((res) => res.open)
    .map((res) => ({ port: res.port, time: res.time as number }))
    .sort((a, b) => a.port - b.port);
}
