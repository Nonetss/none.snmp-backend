import { db } from '@/core/config';
import { hrSWRunEntryTable, hrSWRunPerfEntryTable, resourceTable } from '@/db';
import { eq, and, desc } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceServicesRoute } from './get.route';

export const getDeviceServicesHandler: RouteHandler<
  typeof getDeviceServicesRoute
> = async (c) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  try {
    // Obtenemos el recurso padre para filtrar
    const [hrResource] = await db
      .select()
      .from(resourceTable)
      .where(
        and(
          eq(resourceTable.deviceId, deviceId),
          eq(resourceTable.name, 'Host Resources'),
        ),
      );

    if (!hrResource) return c.json([], 200);

    // Obtenemos los procesos del último snapshot (basándonos en la fecha máxima)
    const latestRun = await db
      .select()
      .from(hrSWRunEntryTable)
      .where(eq(hrSWRunEntryTable.resourceId, hrResource.id))
      .orderBy(desc(hrSWRunEntryTable.date))
      .limit(1);

    if (latestRun.length === 0) return c.json([], 200);
    const lastDate = latestRun[0].date;

    const services = await db
      .select({
        id: hrSWRunEntryTable.id,
        index: hrSWRunEntryTable.hrSWRunIndex,
        name: hrSWRunEntryTable.hrSWRunName,
        path: hrSWRunEntryTable.hrSWRunPath,
        parameters: hrSWRunEntryTable.hrSWRunParameters,
        type: hrSWRunEntryTable.hrSWRunType,
        status: hrSWRunEntryTable.hrSWRunStatus,
        cpu: hrSWRunPerfEntryTable.hrSWRunPerfCPU,
        mem: hrSWRunPerfEntryTable.hrSWRunPerfMem,
        lastSeen: hrSWRunEntryTable.date,
      })
      .from(hrSWRunEntryTable)
      .leftJoin(
        hrSWRunPerfEntryTable,
        and(
          eq(hrSWRunEntryTable.resourceId, hrSWRunPerfEntryTable.resourceId),
          eq(
            hrSWRunEntryTable.hrSWRunIndex,
            hrSWRunPerfEntryTable.hrSWRunIndex,
          ),
          eq(hrSWRunEntryTable.date, hrSWRunPerfEntryTable.date),
        ),
      )
      .where(
        and(
          eq(hrSWRunEntryTable.resourceId, hrResource.id),
          eq(hrSWRunEntryTable.date, lastDate),
        ),
      );

    return c.json(
      services.map((s) => ({
        ...s,
        lastSeen: s.lastSeen.toISOString(),
      })),
      200,
    );
  } catch (error) {
    console.error(`[Get Device Services] Error for device ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
