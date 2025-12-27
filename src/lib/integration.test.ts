import { expect, test, describe } from 'bun:test';
import { pingHost } from '@/lib/icmp';
import { getSNMP } from '@/lib/snmp/index';

// Configuración basada en tu src/prueba.ts
const TARGET_IP = process.env.TARGET_IP!;
const OIDS = ['1.3.6.1.2.1.1.1.0', '1.3.6.1.2.1.1.5.0'];

const mockDbConfig: any = {
  version: 'v3',
  port: 161,
  v3User: process.env.SNMP_V3_USER,
  v3Level: 'authPriv',
  v3AuthProtocol: 'sha',
  v3AuthKey: process.env.SNMP_V3_AUTH_KEY,
  v3PrivProtocol: 'aes',
  v3PrivKey: process.env.SNMP_V3_PRIV_KEY,
};

describe(`Integration Tests against ${TARGET_IP}`, () => {
  test('Debería responder al ping', async () => {
    const res = await pingHost(TARGET_IP);
    console.log(`[PING] Alive: ${res.alive}, Time: ${res.time}ms`);
    expect(res.alive).toBe(true);
  });

  test('Debería responder a consulta SNMP v3', async () => {
    try {
      const varbinds = await getSNMP(TARGET_IP, mockDbConfig, OIDS);
      console.log(`[SNMP] Respuestas recibidas: ${varbinds.length}`);

      varbinds.forEach((v) => {
        console.log(`  OID: ${v.oid}, Value: ${v.value?.toString()}`);
      });

      expect(varbinds.length).toBeGreaterThan(0);
      expect(varbinds[0].value).toBeDefined();
    } catch (error) {
      console.error('[SNMP Error]', error);
      throw error;
    }
  }, 10000); // Timeout extendido para red
});
