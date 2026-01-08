import { db } from '@/core/config';
import { deviceTagTable } from '@/db';
import { and, inArray } from 'drizzle-orm';
import type { RouteHandler } from '@hono/zod-openapi';
import type {
  postAssignTagsRoute,
  postUnassignTagsRoute,
} from './assign.route';

export const postAssignTagsHandler: RouteHandler<
  typeof postAssignTagsRoute
> = async (c) => {
  try {
    const { deviceIds, tagIds } = c.req.valid('json');

    if (deviceIds.length === 0 || tagIds.length === 0) {
      return c.json({ message: 'Device IDs and Tag IDs cannot be empty' }, 200);
    }

    const entries = [];
    for (const deviceId of deviceIds) {
      for (const tagId of tagIds) {
        entries.push({ deviceId, tagId });
      }
    }

    await db.insert(deviceTagTable).values(entries).onConflictDoNothing();

    return c.json({ message: 'Tags assigned successfully' }, 200);
  } catch (error) {
    console.error('[Assign Tags] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};

export const postUnassignTagsHandler: RouteHandler<
  typeof postUnassignTagsRoute
> = async (c) => {
  try {
    const { deviceIds, tagIds } = c.req.valid('json');

    if (deviceIds.length === 0 || tagIds.length === 0) {
      return c.json({ message: 'Device IDs and Tag IDs cannot be empty' }, 200);
    }

    await db
      .delete(deviceTagTable)
      .where(
        and(
          inArray(deviceTagTable.deviceId, deviceIds),
          inArray(deviceTagTable.tagId, tagIds),
        ),
      );

    return c.json({ message: 'Tags unassigned successfully' }, 200);
  } catch (error) {
    console.error('[Unassign Tags] Error:', error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
