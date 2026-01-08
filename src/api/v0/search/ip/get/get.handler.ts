import { db } from '@/core/config';
import { ipAddrEntryTable, ipNetToMediaTable, ipSnmpTable } from '@/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import type { RouteHandler } from '@hono/zod-openapi';
import type { getDeviceIpRoute } from './get.route';

export const getDeviceIpHandler: RouteHandler<typeof getDeviceIpRoute> = async (
  c,
) => {
  const { id } = c.req.valid('param');
  const deviceId = parseInt(id, 10);

  try {
    const [ipSnmp] = await db
      .select()
      .from(ipSnmpTable)
      .where(eq(ipSnmpTable.deviceId, deviceId));
    if (!ipSnmp) return c.json({ addresses: [], arpTable: [] }, 200);

    const addresses = await db
      .select()
      .from(ipAddrEntryTable)
      .where(eq(ipAddrEntryTable.ipSnmpId, ipSnmp.id));
    const fdbTable = await db
      .select()
      .from(ipNetToMediaTable)
      .where(eq(ipNetToMediaTable.ipSnmpId, ipSnmp.id));

    return c.json(
      {
        addresses: addresses.map((a) => ({
          ip: a.ipAdEntAddr,
          ifIndex: a.ipAdEntIfIndex,
          netmask: a.ipAdEntNetMask,
          broadcast: a.ipAdEntBcastAddr,
          time: a.time.toISOString(),
        })),
        fdbTable: fdbTable.map((a) => ({
          ifIndex: a.ipNetToMediaIfIndex,
          physAddress: a.ipNetToMediaPhysAddress,
          netAddress: a.ipNetToMediaNetAddress,
          type: a.ipNetToMediaType,
          time: a.time.toISOString(),
        })),
      },
      200,
    );
  } catch (error) {
    console.error(`[Get Device IP] Error for device ${id}:`, error);
    return c.json({ message: 'Internal Server Error' }, 500) as any;
  }
};
