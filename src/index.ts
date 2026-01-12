import { Scalar } from '@scalar/hono-api-reference';
import { z, createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Handler } from 'hono';
import { sendExcel } from '@/lib/excel';

const app = new OpenAPIHono();

app.use('*', cors());
app.use('*', logger());

app.use('*', async (c, next) => {
  await next();
  if (c.req.query('excel') === 'true' && c.res.status === 200) {
    const contentType = c.res.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await c.res.clone().json();
        const exportData = Array.isArray(data) ? data : [data];
        const filename =
          c.req.path.split('/').filter(Boolean).pop() || 'export';
        c.res = await sendExcel(c, exportData, filename);
      } catch (err) {
        console.error('[Excel Middleware] Error converting to excel:', err);
      }
    }
  }
});

const rootSchema = z.object({
  message: z.string().openapi({ example: 'Hello, World!' }),
});

const rootRoute = createRoute({
  method: 'get',
  path: '/api/health',
  summary: 'Health check',
  description: 'Health check',
  request: {},
  responses: {
    200: {
      content: {
        'application/json': {
          schema: rootSchema,
        },
      },
      description: 'Root endpoint',
    },
  },
});

const rootHandler: Handler = (c) => {
  return c.json({ message: 'Hello, World!' });
};

app.openapi(rootRoute, rootHandler);

import apiRouter from '@/api';
import { initScheduler } from '@/core/services/scheduler.service';
import { seedMetrics } from '@/lib/snmp/seed';
import { seedDefaultTasks } from '@/lib/snmp/seedTasks';

import { logger as pinoLogger } from '@/lib/logger';

app.route('/api', apiRouter);

// Initial database seeding
async function initialize() {
  try {
    const mibs = await seedMetrics();
    pinoLogger.info(`[Seed] Successfully seeded ${mibs.length} MIBs`);

    await seedDefaultTasks();

    // Initialize background scheduler
    await initScheduler();
  } catch (err) {
    pinoLogger.error({ err }, '[Seed] Critical error during initialization');
  }
}

initialize();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'NONE.SNMP',
  },
});

app.get('/scalar', Scalar({ url: '/doc' }));

Bun.serve({
  port: 3000,
  fetch: app.fetch,
  idleTimeout: 0,
});
