import { getSNMPv1 } from '@/lib/snmp/v1';
import { getSNMPv2c } from '@/lib/snmp/v2c';
import { getSNMPv3 } from '@/lib/snmp/v3';
import type { snmpTable } from '@/db/models/snmp.table';
import type { InferSelectModel } from 'drizzle-orm';
import * as snmp from 'net-snmp';

export * from '@/lib/snmp/v1';
export * from '@/lib/snmp/v2c';
export * from '@/lib/snmp/v3';

type SNMPRecord = InferSelectModel<typeof snmpTable>;

export async function getSNMP(ip: string, config: SNMPRecord, oids: string[]) {
  switch (config.version) {
    case 'v1':
      return getSNMPv1(
        {
          ip,
          port: config.port,
          community: config.community,
        },
        oids,
      );
    case 'v2c':
      return getSNMPv2c(
        {
          ip,
          port: config.port,
          community: config.community,
        },
        oids,
      );
    case 'v3':
      return getSNMPv3(
        {
          ip,
          port: config.port,
          user: config.v3User,
          level: config.v3Level as any,
          authProtocol: config.v3AuthProtocol as any,
          authKey: config.v3AuthKey,
          privProtocol: config.v3PrivProtocol as any,
          privKey: config.v3PrivKey,
        },
        oids,
      );
    default:
      throw new Error(`Unsupported SNMP version: ${config.version}`);
  }
}

export function formatVarbinds(varbinds: snmp.Varbind[]) {
  return varbinds.map((v) => ({
    oid: v.oid,
    value: v.value?.toString(),
    type: v.type,
  }));
}
