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
 * Escanea un rango de puertos o una lista específica de forma concurrente.
 */
export async function scanPorts(
  ip: string,
  ports: number[],
  concurrency = 100,
  timeout = 1000,
): Promise<{ port: number; time: number }[]> {
  const openPorts: { port: number; time: number }[] = [];

  for (let i = 0; i < ports.length; i += concurrency) {
    const batch = ports.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (port) => {
        const res = await checkTcpPort(ip, port, timeout);
        return { port, ...res };
      }),
    );

    for (const res of results) {
      if (res.open) {
        openPorts.push({ port: res.port, time: res.time as number });
      }
    }
  }

  return openPorts.sort((a, b) => a.port - b.port);
}
