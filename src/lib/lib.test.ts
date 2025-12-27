import { expect, test, describe, mock } from 'bun:test';

// Mocks antes de importar las funciones para que Bun los use
mock.module('pingman', () => {
  return {
    default: async (ip: string, options: any) => {
      return { alive: true, time: 10 };
    },
  };
});

mock.module('net-snmp', () => {
  return {
    Version1: 0,
    Version2c: 1,
    Version3: 3,
    SecurityLevel: { noAuthNoPriv: 1, authNoPriv: 2, authPriv: 3 },
    AuthProtocols: { md5: 1, sha: 2 },
    PrivProtocols: { des: 1, aes: 2 },
    createSession: (ip: string, community: string, options: any) => ({
      get: (oids: string[], cb: Function) =>
        cb(null, [{ oid: oids[0], value: Buffer.from('test-v1-v2'), type: 4 }]),
      close: () => {},
    }),
    createV3Session: (ip: string, user: any, options: any) => ({
      get: (oids: string[], cb: Function) =>
        cb(null, [
          { oid: oids[0], value: Buffer.from(`test-v3-${user.name}`), type: 4 },
        ]),
      close: () => {},
    }),
  };
});

import { pingHost } from '@/lib/icmp';
import { getSNMPv1, getSNMPv3 } from '@/lib/snmp';
import { getSNMP, formatVarbinds } from '@/lib/snmp/index';

describe('ICMP / Ping', () => {
  test('pingHost debería devolver estado alive', async () => {
    const res = await pingHost('127.0.0.1');
    expect(res.alive).toBe(true);
    expect(res.time).toBe(10);
  });
});

describe('SNMP Versions', () => {
  test('getSNMPv1 debería obtener varbinds correctamente', async () => {
    const res = await getSNMPv1(
      { ip: '127.0.0.1', port: 161, community: 'public' },
      ['1.3.6.1.2.1.1.1.0'],
    );
    expect(res?.[0].oid).toBe('1.3.6.1.2.1.1.1.0');
    expect(res?.[0].value?.toString()).toBe('test-v1-v2');
  });

  test('getSNMPv3 debería mapear correctamente la configuración de seguridad', async () => {
    const config = {
      ip: '127.0.0.1',
      port: 161,
      user: 'admin',
      level: 'authPriv' as const,
      authProtocol: 'sha' as const,
      authKey: 'authKey',
      privProtocol: 'aes' as const,
      privKey: 'privKey',
    };
    const res = await getSNMPv3(config, ['1.3.6.1.2.1.1.1.0']);
    expect(res?.[0].value?.toString()).toBe('test-v3-admin');
  });
});

describe('SNMP Unified Entrypoint', () => {
  test('getSNMP debería llamar a la versión correcta según el config', async () => {
    const mockConfig: any = {
      version: 'v3',
      port: 161,
      v3User: 'tester',
      v3Level: 'authPriv',
      v3AuthProtocol: 'sha',
      v3AuthKey: 'key',
      v3PrivProtocol: 'aes',
      v3PrivKey: 'key',
    };

    const res = await getSNMP('10.0.0.1', mockConfig, ['1.1.1.1']);
    expect(res?.[0].value?.toString()).toBe('test-v3-tester');
  });

  test('formatVarbinds debería formatear los resultados a un objeto plano', () => {
    const mockVarBinds = [
      { oid: '1.2.3', value: Buffer.from('hello'), type: 4 },
    ];
    const formatted = formatVarbinds(mockVarBinds as any);
    expect(formatted[0]).toEqual({
      oid: '1.2.3',
      value: 'hello',
      type: 4,
    });
  });
});
