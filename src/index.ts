import { Scalar } from '@scalar/hono-api-reference';
import { z, createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { Handler } from 'hono';

const app = new OpenAPIHono();

app.use('*', cors());
app.use('*', logger());

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

app.route('/api', apiRouter);

// Initial database seeding
async function initialize() {
  try {
    const mibs = await seedMetrics();
    console.log(`[Seed] Successfully seeded ${mibs.length} MIBs`);

    await seedDefaultTasks();

    // Initialize background scheduler
    initScheduler();
  } catch (err) {
    console.error('[Seed] Critical error during initialization:', err);
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
