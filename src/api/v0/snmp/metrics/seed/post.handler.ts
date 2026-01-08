import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { postSeedRoute } from './post.route';
import { seedMetrics } from '@/lib/snmp/seed';

export const postSeedHandler: RouteHandler<typeof postSeedRoute> = async (
  c,
) => {
  try {
    const mibsProcessed = await seedMetrics();

    return c.json(
      {
        message: 'Seeding completed successfully',
        mibsProcessed,
      },
      200,
    );
  } catch (error) {
    console.error('Error seeding metrics:', error);
    return c.json(
      { message: 'Internal Server Error', mibsProcessed: [] },
      500,
    ) as any;
  }
};
