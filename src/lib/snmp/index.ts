import { walkSNMPv1, getSNMPv1 } from '@/lib/snmp/v1';
import { walkSNMPv2c, getSNMPv2c } from '@/lib/snmp/v2c';
import { walkSNMPv3, getSNMPv3 } from '@/lib/snmp/v3';
import type { snmpAuthTable } from '@/db/models/snmpAuth.table';
import type { InferSelectModel } from 'drizzle-orm';
import * as snmp from 'net-snmp';

export * from '@/lib/snmp/v1';
export * from '@/lib/snmp/v2c';
export * from '@/lib/snmp/v3';

type SNMPRecord = InferSelectModel<typeof snmpAuthTable>;

export async function getSNMP(
  ip: string,
  config: SNMPRecord,
  oids: string[],
  timeout: number = 5000,
) {
  switch (config.version) {
    case 'v1':
      return getSNMPv1(
        {
          ip,
          port: config.port,
          community: config.community,
        },
        oids,
        timeout,
      );
    case 'v2c':
      return getSNMPv2c(
        {
          ip,
          port: config.port,
          community: config.community,
        },
        oids,
        timeout,
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
        timeout,
      );
    default:
      throw new Error(`Unsupported SNMP version: ${config.version}`);
  }
}

export async function walkSNMP(
  ip: string,
  config: SNMPRecord,
  rootOid: string,
  timeout: number = 5000,
) {
  switch (config.version) {
    case 'v1':
      return walkSNMPv1(
        {
          ip,
          port: config.port,
          community: config.community,
        },
        rootOid,
        timeout,
      );
    case 'v2c':
      return walkSNMPv2c(
        {
          ip,
          port: config.port,
          community: config.community,
        },
        rootOid,
        timeout,
      );
    case 'v3':
      return walkSNMPv3(
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
        rootOid,
        timeout,
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

/**
 * Sanitiza una cadena eliminando caracteres nulos (\0) que PostgreSQL no soporta en tipos varchar/text.
 */
export function sanitizeString(val: any): string {
  if (val === null || val === undefined) return '';
  const str = Buffer.isBuffer(val) ? val.toString('utf-8') : String(val);
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x00/g, '').trim();
}

/**
 * Normaliza una dirección MAC a formato XX:XX:XX:XX:XX:XX en mayúsculas.
 * Soporta Buffer y strings con diferentes separadores (-, :) o sin ellos.
 */
export function normalizeMac(val: any): string | null {
  if (!val) return null;

  let str = '';
  if (Buffer.isBuffer(val)) {
    // Si es un buffer de 6 bytes, es probable que sea una MAC binaria
    if (val.length === 6) {
      return Array.from(val)
        .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
        .join(':');
    }
    str = val.toString('utf-8');
  } else {
    str = String(val);
  }

  const clean = str.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  if (clean.length === 12) {
    return clean.match(/.{1,2}/g)?.join(':');
  }

  // Si no tiene 12 caracteres hex, devolvemos el string original saneado por si acaso
  return sanitizeString(str);
}
