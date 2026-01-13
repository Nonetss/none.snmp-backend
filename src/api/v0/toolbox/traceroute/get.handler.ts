import type { RouteHandler } from '@hono/zod-openapi';
import type { getTracerouteRoute } from './get.route';
import { spawn } from 'child_process';

export const getTracerouteHandler: RouteHandler<
  typeof getTracerouteRoute
> = async (c) => {
  const { host } = c.req.valid('query');

  try {
    const hops = await new Promise<any[]>((resolve, reject) => {
      const hopsList: any[] = [];
      const command = 'traceroute';
      const args = ['-n', host];

      const child = spawn(command, args);

      let buffer = '';

      child.stdout.on('data', (data) => {
        buffer += data.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('traceroute')) continue;

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

            // Basic IP check
            if (/^(\d{1,3}\.){3}\d{1,3}$/.test(part)) {
              if (!ip) ip = part;
            } else if (part === 'ms') {
              const val = parts[i - 1];
              if (!isNaN(parseFloat(val))) {
                rtt.push(`${val} ms`);
              }
            }
          }

          hopsList.push({
            hop: hopNumber,
            ip: ip,
            rtt: rtt,
          });
        }
      });

      child.on('close', (code) => {
        // Sort hops just in case they arrived out of order due to buffering
        const sortedHops = hopsList.sort((a, b) => a.hop - b.hop);
        resolve(sortedHops);
      });

      child.on('error', (err) => {
        reject(err);
      });
    });

    return c.json({ host, hops }, 200);
  } catch (err) {
    console.error(`[Traceroute] Error:`, err);
    return c.json({ message: 'Error starting traceroute' }, 500) as any;
  }
};
