import type { RouteHandler } from '@hono/zod-openapi';
import type { getTracerouteRoute } from './get.route';
import { spawn } from 'child_process';

export const getTracerouteHandler: RouteHandler<
  typeof getTracerouteRoute
> = async (c) => {
  const { host } = c.req.valid('query');

  return new Promise((resolve) => {
    const hops: any[] = [];
    const command = process.platform === 'win32' ? 'tracert' : 'traceroute';
    // Use -n to avoid DNS resolution for faster parsing, and -q 1 for single query if speed is preferred,
    // but default (3 queries) matches the schema better.
    const args = process.platform === 'win32' ? ['-d', host] : ['-n', host];

    const child = spawn(command, args);

    let buffer = '';

    child.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (
          !trimmed ||
          trimmed.startsWith('traceroute') ||
          trimmed.startsWith('Tracing')
        )
          continue;

        // Regex for Linux traceroute -n output:
        // 1  172.19.3.1  0.203 ms  0.185 ms  0.137 ms
        // 5  * * 172.29.152.117  1.295 ms
        const parts = trimmed.split(/\s+/);
        const hopNumber = parseInt(parts[0], 10);

        if (isNaN(hopNumber)) continue;

        const rtt: string[] = [];
        let ip: string | null = null;

        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];
          if (part === '*') continue;

          // Basic IP check (could be refined)
          if (/^(\d{1,3}\.){3}\d{1,3}$/.test(part)) {
            if (!ip) ip = part;
          } else if (part === 'ms') {
            const val = parts[i - 1];
            if (!isNaN(parseFloat(val))) {
              rtt.push(`${val} ms`);
            }
          }
        }

        hops.push({
          hop: hopNumber,
          ip: ip,
          rtt: rtt,
        });
      }
    });

    child.on('close', (code) => {
      resolve(c.json({ host, hops }, 200));
    });

    child.on('error', (err) => {
      console.error(`[Traceroute] Error spawning process:`, err);
      resolve(c.json({ message: 'Error starting traceroute' }, 500) as any);
    });
  });
};
